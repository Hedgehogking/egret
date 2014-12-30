module Game {
    /**
     * 主游戏容器
     */
    export class GameContainer extends egret.DisplayObjectContainer {

        public stageW:number;
        public stageH:number;
        //topbar 时间轴
        private bannerContainer:Game.Banner;

        //玩家信息
        /**外部传参*/
        private playerName:string = window['params'].name;//玩家名称
        /**外部传参*/
        private maxScore:number = window['params'].highestScore;//历史最高分数
        private curScore:number = 0;
        private times:number = window['params'].times;//玩家剩余次数
        private maxRank:number = 0;//玩家最高排名

        //开始按钮
        private btnStart:Game.Button;

        //圣诞老人
        private mySanta:Game.Santa;
        private mySantaInitX:number = 200;
        private mySantaInitY:number = 145;

        //礼物
        private allGifts:any[] = [];
        private giftTimer:egret.Timer;
        private creatGiftInterval:number = 500;//礼物出现的时间间隔
        private speed:number = 0.25;//礼物的速度根据自身分数变化的系数

        //车子
        private myCarContainer:egret.DisplayObjectContainer;
        private myCar:egret.Bitmap;
        private carStartX:number;
        private moveStartX:number;
        private distance:number;
        //车子显示的分数
        private scoreTextArr:Game.ScoreText[] = [];
        //车子发光
        private catchlight:egret.Bitmap;

        //飘雪
        private allSnow:any[] = [];
        private snowTimer:egret.Timer;
        private creatSnowInterval:number = 100;//飘雪出现的时间间隔
        private preCreatSnow:number = 60;//预先新建一定数量的雪

        //弹出成绩
        private scorePanel:Game.ScorePanel;
        //弹出分享
        private sharePanel:Game.SharePanel;

        //游戏开始获取random_key
        private postGameStart:egret.URLLoader;
        private random_key:string;
        //提交成绩
        private postScore:egret.URLLoader;
        private ajaxLoading:Game.Loading;
        private requestTimer:egret.Timer;


        //游戏时间变量
        /**外部传参*/
        private totalTime:number = window['params'].gameTime;//游戏时间长度
        private startTime:number;
        private lastTime:number;


        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        /**初始化*/
        private onAddToStage(event:egret.Event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;

            this.getBg();
        }

        /**加载背景*/
        private getBg():void{
            RES.getResByUrl(window["params"]["backgroundUrl"],this.getBgComplete,this);
        }
        /**背景*/
        private getBgComplete(data:any):void{
            var bg:egret.Bitmap = new egret.Bitmap();//创建背景
            if(!!data){
                bg.texture = data;
            }else{
                bg.texture = RES.getRes('gameBg');
            }
            bg.width = this.stageW;
            bg.height = this.stageH;
            this.addChild(bg);
            this.createGameScene();
        }


        /**创建游戏场景*/
        private createGameScene():void {
            this.touchEnabled = true;
            //topbar
            this.bannerContainer = new Game.Banner();
            this.bannerContainer.y = 10;
            this.addChild(this.bannerContainer);
            //设置用户信息
            this.setPlayerInfo();


            //开始按钮
            this.btnStart = new Game.Button(window["lanLib"]["btn_start"]);
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2;//居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2;//居中定位
            this.btnStart.touchEnabled = true;
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);//点击按钮开始游戏
            this.addChild(this.btnStart);


            //圣诞老人
            this.mySanta = new Game.Santa();
            this.mySanta.y = this.mySantaInitX;
            this.mySanta.x = this.mySantaInitY;
            this.addChild(this.mySanta);
            this.mySanta.start();
            //派礼物计时器
            this.giftTimer = new egret.Timer(this.creatGiftInterval);
            this.giftTimer.addEventListener(egret.TimerEvent.TIMER, this.createGift, this);


            //车子
            this.myCarContainer = new egret.DisplayObjectContainer();
            this.myCar = new egret.Bitmap(RES.getRes('car'));
            this.myCarContainer.addChild(this.myCar);
            this.addChild(this.myCarContainer);
            this.myCarContainer.y = 860;
            this.myCarContainer.x = (this.stageW - this.myCar.width) /2;
            //使carOrientation函数里面的this指向当前对象this，而非window对象;
            this.carOrientation = this.carOrientation.bind(this);
            //车子的光芒
            this.catchlight = new egret.Bitmap(RES.getRes('catchlight'));
            this.catchlight.y = -46;
            this.catchlight.alpha = 0;
            this.myCarContainer.addChild(this.catchlight);

            //飘雪计时器
            this.snowTimer = new egret.Timer(this.creatSnowInterval);
            this.snowTimer.addEventListener(egret.TimerEvent.TIMER, this.createSnow, this);
            this.snowTimer.start();
            //预先生成一定数量的飘雪
            var i:number = 0;
            for(i = 0; i < this.preCreatSnow; i++){
                this.createSnow();
            }

        }


        /**游戏重置*/
        private initGame():void {
            //设置用户信息
            this.maxScore = Math.max(this.maxScore, this.curScore);
            this.curScore = 0;
            this.setPlayerInfo();
            //时间轴充满
            this.bannerContainer.init(this.totalTime);
            //圣诞老人归位
            this.mySanta.y = 150;
            this.mySanta.x = this.stageW - this.mySanta.width;
            this.mySanta.init();
            //清空礼物
            var i:number = 0;
            for (i = 0; i < this.allGifts.length; i++) {
                var delGift:Game.Gift = this.allGifts[i];
                Game.Gift.reclaim(delGift);
                this.removeChild(delGift);
            }
            this.allGifts = [];
            //清空分数动画
            for (i = 0; i < this.scoreTextArr.length; i++) {
                var delScoreText:Game.ScoreText = this.scoreTextArr[i];
                egret.Tween.removeTweens(delScoreText);
                Game.ScoreText.reclaim(delScoreText);
                this.removeChild(delScoreText);
            }
            this.scoreTextArr = [];
            //车子归位
            this.myCarContainer.x = (this.stageW - this.myCar.width) /2;
        }

        /**设置用户信息*/
        private setPlayerInfo():void {
            this.bannerContainer.setBannerInfo(this.playerName, this.maxScore, this.curScore);
        }

        /**车子根据重力感应移动*/
        private carOrientation(e){
            this.myCarContainer.x += e.gamma;
            if(this.myCarContainer.x >= this.stageW - this.myCarContainer.width / 2){
                this.myCarContainer.x = this.stageW - this.myCarContainer.width / 2;
            }else if(this.myCarContainer.x <= -1 * this.myCarContainer.width / 2){
                this.myCarContainer.x = -1 * this.myCarContainer.width / 2;
            }
        }
        private enableMoveCarByOrientation(){
            window.addEventListener('deviceorientation',this.carOrientation)
        }
        private disableMoveCarByOrientation(){
            window.removeEventListener('deviceorientation',this.carOrientation);
        }
        /**拖动车子传统方法*/
        private moveCarBegin(evt:egret.TouchEvent):void{
            this.carStartX = this.myCarContainer.x;
            this.moveStartX = evt.stageX;
        }
        private moveCar(evt:egret.TouchEvent):void{
            this.distance = evt.stageX - this.moveStartX;
            //判断是否超出屏幕
            if(this.carStartX + this.distance >= this.stageW - this.myCarContainer.width / 2){
                this.myCarContainer.x = this.stageW - this.myCarContainer.width / 2;
            }else if(this.carStartX + this.distance <= -1 * this.myCarContainer.width / 2){
                this.myCarContainer.x = -1 * this.myCarContainer.width / 2;
            }else{
                this.myCarContainer.x = this.carStartX + this.distance;
            }
        }
        /**允许车子滑动*/
        private enableMoveCar():void{
            this.myCarContainer.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.moveCarBegin,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.moveCar,this);

            this.enableMoveCarByOrientation();
        }
        /**禁止车子滑动*/
        private disableMoveCar():void{
            this.myCarContainer.touchEnabled = false;
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.moveCarBegin,this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.moveCar,this);

            this.disableMoveCarByOrientation();
        }

        /**创建礼物*/
        private createGift():void {
            var giftX:number;
            if (this.mySanta.direction == 'left') {
                giftX = this.stageW - this.mySanta.width + this.mySanta.getSantaX() + 210;
            } else {
                giftX = this.stageW - this.mySanta.width + this.mySanta.getSantaX() + 60;
            }
            if (giftX + 70 > 0 && giftX < this.stageW + 70) {
                var gift:Game.Gift = Game.Gift.produce();
                gift.x = giftX;
                gift.y = 220;
                this.addChild(gift);
                this.allGifts.push(gift);
            }

        }

        /**更新战绩*/
        private setScore():void {
            this.bannerContainer.setScore(this.curScore);
        }

        /**更新战绩动画*/
        private setScoreAnimation(score):void {
            //显示分数
            var scoreText:string = score > 0 ? '+' + score.toString() : score.toString();
            var scoreX:number;
            var scoreY:number;
            var scoreAnimate:egret.Tween;
            var text:Game.ScoreText;
            text = Game.ScoreText.produce(scoreText);
            this.addChild(text);
            scoreX = this.myCarContainer.x + this.myCar.width - 50;
            scoreY = this.myCarContainer.y - 30;
            text.x = scoreX;
            text.y = scoreY;
            scoreAnimate = egret.Tween.get(text);
            scoreAnimate.to({x:scoreX,y:scoreY-50},500).call(this.scoreAnimationEnd,this);
            this.scoreTextArr.push(text);
            //显示发光
            egret.Tween.removeTweens(this.catchlight);
            egret.Tween.get(this.catchlight).to({alpha:1},200).to({alpha:0},200);

        }
        private scoreAnimationEnd():void{
            var delScoreText:Game.ScoreText = this.scoreTextArr.shift();
            egret.Tween.removeTweens(delScoreText);
            Game.ScoreText.reclaim(delScoreText);
            this.removeChild(delScoreText);
        }

        /**创建飘雪*/
        private createSnow(){
            var snow:Game.Snow = Game.Snow.produce();
            var snowX:number;
            var snowMoveTime:number = 10000;
            snowX = Math.random() * this.stageW;
            snow.x = snowX;
            if(this.allSnow.length < this.preCreatSnow){
                snow.y = Math.random() * this.stageH;
                snowMoveTime = (this.stageH - snow.y) * 10;
            }else{
                snow.y = -20;
            }
            this.addChild(snow);
            this.allSnow.push(snow);
            //飘雪动作
            egret.Tween.removeTweens(snow);
            egret.Tween.get(snow).to({x:snow.x + (Math.random() - 0.5) * this.stageW,y:this.stageH + 20},snowMoveTime).call(this.snowAnimationEnd,this);
        }
        /**消除飘雪*/
        private snowAnimationEnd():void{
            var snow:Game.Snow = this.allSnow.shift();
            egret.Tween.removeTweens(snow);
            Game.Snow.reclaim(snow);
            this.removeChild(snow);
        }

        /**游戏开始*/
        private gameStart():void {
            //判断是否还有机会
            if(this.times <= 0){
                this.sharePanel = new Game.SharePanel();
                this.sharePanel.width = this.stageW;
                this.sharePanel.height = this.stageH;
                this.sharePanel.anchorX = this.sharePanel.anchorY = 0.5;
                this.sharePanel.x = this.stageW / 2;
                this.sharePanel.y = this.stageH / 2;
                this.sharePanel.scaleX = this.sharePanel.scaleY = 0;
                this.sharePanel.touchEnabled = true;
                this.sharePanel.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeSharePanel,this);
                this.addChild(this.sharePanel);
                egret.Tween.get(this.sharePanel).to({scaleX:1,scaleY:1},1000,egret.Ease.backOut).call(this.sharePanelShowFinish,this);
            }else{
                //egret自带post获取游戏random_key
                //this.postGameStart = new egret.URLLoader();
                //var urlreq:egret.URLRequest = new egret.URLRequest();
                //urlreq.url = window["params"].postScoreUrl;
                //urlreq.method = egret.URLRequestMethod.POST;
                //urlreq.data = new egret.URLVariables("action=check_fruad");
                //this.postGameStart.dataFormat = egret.URLLoaderDataFormat.VARIABLES;
                //this.postGameStart.addEventListener(egret.Event.COMPLETE,this.postGameStartComplete,this);
                //this.postGameStart.load(urlreq);

                //Zepto的post
                //Zepto.ajax({
                //    url:'',
                //    type:'post',
                //    dataType:'json',
                //    data:{
                //        action:'check_fruad'
                //    },
                //    success:function(data){
                //        console.log(data);
                //        window["random_key"] = data.data;
                //    }
                //})

                //外部jQuery的post
                postGameStart();

                //this.init();

                //重置游戏
                this.initGame();
                //时间重置
                this.startTime = this.lastTime = egret.getTimer();
                //移除开始按钮
                if(this.btnStart.parent){
                    this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
                    this.removeChild(this.btnStart);
                }

                //开始创建礼物
                this.giftTimer.start();
                //圣诞老人动画开始
                this.mySanta.start();
                //车子可以滑动
                this.enableMoveCar();

                this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            }
        }


        /**游戏画面更新*/
        private gameViewUpdate():void {
            //游戏时间机制
            var nowTime:number = egret.getTimer();
            var fps:number = 1000 / (nowTime - this.lastTime);
            var speedOffset:number = 60 / fps;
            this.lastTime = nowTime;

            var i:number = 0;
            //礼物
            var giftCount:number = this.allGifts.length;
            var curGift:Game.Gift;
            var giftY:number;
            var delGift:any[] = [];
            var curDelGift:Game.Gift;

            //更新时间轴和分数
            this.bannerContainer.updateBanner(speedOffset);

            //更新圣诞老人位置
            this.mySanta.updateSanta(speedOffset);

            //更新礼物位置
            for (i = 0; i < giftCount; i++) {
                curGift = this.allGifts[i];
                giftY = curGift.y;
                giftY += curGift.score * this.speed * speedOffset;
                curGift.y = giftY;
                if (giftY > this.stageH) {
                    delGift.push(curGift)
                }
            }
            for (i = 0; i < delGift.length; i++) {
                curDelGift = delGift[i];
                Game.Gift.reclaim(curDelGift);
                this.removeChild(curDelGift);
                this.allGifts.splice(this.allGifts.indexOf(curDelGift), 1);
            }


            this.gameHitTest();

            //到时间，游戏结束
            if (this.lastTime - this.startTime > this.totalTime * 1000) {
                this.gameStop();
            }

        }

        /**基于矩形的碰撞检测*/
        private judgeHitTest(obj1:egret.Bitmap,obj2:Game.Gift):boolean
        {
            var rect1:egret.Rectangle = obj1.getBounds();
            var rect2:egret.Rectangle = obj2.bounds;
            rect1.x = this.myCarContainer.x;//本该为obj1的
            rect1.y = this.myCarContainer.y;//本该为obj1的
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            return rect1.intersects(rect2);
        }
        /**检测碰撞*/
        private gameHitTest():void{
            var i:number = 0;
            var car:egret.Bitmap = this.myCar;
            var gifts:Game.Gift[] = this.allGifts;
            var giftLen:number = gifts.length;
            for(i = 0; i < giftLen; i++){
                var curDelGift:Game.Gift = gifts[i];
                if(curDelGift && this.judgeHitTest(car,curDelGift)){
                    //console.log('hit')
                    var score:number = curDelGift.score;
                    if(curDelGift.giftTypeIdx == 0){
                        score = -1 * score;
                    }
                    this.curScore += score;
                    if(this.curScore <= 0){
                        this.curScore = 0;
                    }
                    this.setScore();
                    this.setScoreAnimation(score);
                    Game.Gift.reclaim(curDelGift);
                    this.removeChild(curDelGift);
                    this.allGifts.splice(this.allGifts.indexOf(curDelGift), 1);
                }
            }
        }

        /**游戏结束*/
        private gameStop():void{
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            //停止创建礼物
            this.giftTimer.stop();
            //停止圣诞老人动画
            this.mySanta.stop();
            //车子不可以滑动
            this.disableMoveCar();
            console.log("stop");

            //显示loading
            this.ajaxLoading = new Game.Loading();
            this.addChild(this.ajaxLoading);
            this.ajaxLoading.play();

            //post数据
            //this.postScore = new egret.URLLoader();
            //var urlreq:egret.URLRequest = new egret.URLRequest();
            //urlreq.url = window["params"].postScoreUrl;
            //urlreq.method = egret.URLRequestMethod.POST;
            //urlreq.data = new egret.URLVariables('action=get_result&random_key=' + this.random_key + '&score=' + this.curScore.toString());
            //this.postScore.dataFormat = egret.URLLoaderDataFormat.TEXT;
            //this.postScore.addEventListener(egret.Event.COMPLETE,this.postScoreComplete,this);
            //this.postScore.load(urlreq);
            postScore(this.curScore);
            this.requestTimer = new egret.Timer(300);
            this.requestTimer.addEventListener(egret.TimerEvent.TIMER, this.checkRequest, this);
            this.requestTimer.start();

        }

        private gameReStart():void{
            this.scorePanel.removeEventListener('gameReStart',this.gameReStart,this);
            if(this.scorePanel.parent && this.times > 0){
                this.scorePanel.clearAnimation();
                this.removeChild(this.scorePanel);
            }
            this.gameStart();
        }

        private scorePanelShowFinish():void{
            egret.Tween.removeTweens(this.scorePanel);
        }

        private closeSharePanel():void{
            this.sharePanel.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.closeSharePanel,this);
            if(this.scorePanel){
                this.scorePanel.addEventListener('gameReStart',this.gameReStart,this);
            }
            if(this.sharePanel.parent){
                this.removeChild(this.sharePanel);
            }
        }

        private sharePanelShowFinish():void{
            egret.Tween.removeTweens(this.sharePanel);
        }

        private postGameStartComplete(event:egret.Event):void{
            console.log(this.postGameStart.data);
            this.random_key = this.postGameStart.data.data;
        }

        private postScoreComplete():void{
            //post完成后执行下面代码
            //console.log(this.postScore.data);
            //隐藏loading
            this.ajaxLoading.stop();
            this.removeChild(this.ajaxLoading);

            if(window["postScoreCompleteData"]["error_code"] != 0){
                alert(window["postScoreCompleteData"]["error_msg"]);
                setTimeout(function(){
                    //window.location.href = window.location.href;
                },1000)
            }else{
                //更新玩家信息
                this.times--;
                this.maxScore = window["postScoreCompleteData"].data.Score;
                this.maxRank = window["postScoreCompleteData"].data.Rank;
                //this.maxScore = this.postScore.data.Score;
                //this.maxRank = this.postScore.data.Rank;
                changeShareText(this.maxScore)

                //显示成绩
                this.scorePanel = new Game.ScorePanel({
                    times:this.times,
                    maxScore:this.maxScore,
                    curScore:this.curScore,
                    maxRank:this.maxRank
                });
                this.scorePanel.width = this.stageW;
                this.scorePanel.height = this.stageH;
                this.scorePanel.anchorX = this.scorePanel.anchorY = 0.5;
                this.scorePanel.x = this.stageW / 2;
                this.scorePanel.y = this.stageH / 2;
                this.scorePanel.scaleX = this.scorePanel.scaleY = 0;
                this.scorePanel.addEventListener('gameReStart',this.gameReStart,this);
                this.addChild(this.scorePanel)
                egret.Tween.get(this.scorePanel).to({scaleX:1,scaleY:1},1000,egret.Ease.backOut).call(this.scorePanelShowFinish,this);
            }
        }

        private checkRequest():void{
            if(window["IsRequestComplete"] == true){
                this.requestTimer.stop();
                this.requestTimer.removeEventListener(egret.TimerEvent.TIMER, this.checkRequest, this);
                this.postScoreComplete();
            }
        }

        private init():void {
            var x = 0;
            var fn = function(e) {
                x += e.gamma;
                this.myCarContainer.x = x;
            };
            window.removeEventListener('deviceorientation', fn, true);
            window.addEventListener('deviceorientation', fn, true)
        }
    }
}