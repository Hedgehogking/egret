var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    /**
     * 主游戏容器
     */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            _super.call(this);
            //玩家信息
            /**外部传参*/
            this.playerName = window['params'].name; //玩家名称
            /**外部传参*/
            this.maxScore = window['params'].highestScore; //历史最高分数
            this.curScore = 0;
            this.times = window['params'].times; //玩家剩余次数
            this.maxRank = 0; //玩家最高排名
            this.mySantaInitX = 200;
            this.mySantaInitY = 145;
            //礼物
            this.allGifts = [];
            this.creatGiftInterval = 500; //礼物出现的时间间隔
            this.speed = 0.25; //礼物的速度根据自身分数变化的系数
            //车子显示的分数
            this.scoreTextArr = [];
            //飘雪
            this.allSnow = [];
            this.creatSnowInterval = 100; //飘雪出现的时间间隔
            this.preCreatSnow = 60; //预先新建一定数量的雪
            //游戏时间变量
            /**外部传参*/
            this.totalTime = window['params'].gameTime; //游戏时间长度
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        /**初始化*/
        GameContainer.prototype.onAddToStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            this.getBg();
        };
        /**加载背景*/
        GameContainer.prototype.getBg = function () {
            RES.getResByUrl(window["params"]["backgroundUrl"], this.getBgComplete, this);
        };
        /**背景*/
        GameContainer.prototype.getBgComplete = function (data) {
            var bg = new egret.Bitmap(); //创建背景
            if (!!data) {
                bg.texture = data;
            }
            else {
                bg.texture = RES.getRes('gameBg');
            }
            bg.width = this.stageW;
            bg.height = this.stageH;
            this.addChild(bg);
            this.createGameScene();
        };
        /**创建游戏场景*/
        GameContainer.prototype.createGameScene = function () {
            this.touchEnabled = true;
            //topbar
            this.bannerContainer = new Game.Banner();
            this.bannerContainer.y = 10;
            this.addChild(this.bannerContainer);
            //设置用户信息
            this.setPlayerInfo();
            //开始按钮
            this.btnStart = new Game.Button(window["lanLib"]["btn_start"]);
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2; //居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2; //居中定位
            this.btnStart.touchEnabled = true;
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮开始游戏
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
            this.myCarContainer.x = (this.stageW - this.myCar.width) / 2;
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
            var i = 0;
            for (i = 0; i < this.preCreatSnow; i++) {
                this.createSnow();
            }
        };
        /**游戏重置*/
        GameContainer.prototype.initGame = function () {
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
            var i = 0;
            for (i = 0; i < this.allGifts.length; i++) {
                var delGift = this.allGifts[i];
                Game.Gift.reclaim(delGift);
                this.removeChild(delGift);
            }
            this.allGifts = [];
            for (i = 0; i < this.scoreTextArr.length; i++) {
                var delScoreText = this.scoreTextArr[i];
                egret.Tween.removeTweens(delScoreText);
                Game.ScoreText.reclaim(delScoreText);
                this.removeChild(delScoreText);
            }
            this.scoreTextArr = [];
            //车子归位
            this.myCarContainer.x = (this.stageW - this.myCar.width) / 2;
        };
        /**设置用户信息*/
        GameContainer.prototype.setPlayerInfo = function () {
            this.bannerContainer.setBannerInfo(this.playerName, this.maxScore, this.curScore);
        };
        /**拖动车子传统方法*/
        GameContainer.prototype.moveCarBegin = function (evt) {
            this.carStartX = this.myCarContainer.x;
            this.moveStartX = evt.stageX;
        };
        GameContainer.prototype.moveCar = function (evt) {
            this.distance = evt.stageX - this.moveStartX;
            this.myCarContainer.x = this.carStartX + this.distance;
        };
        /**允许车子滑动*/
        GameContainer.prototype.enableMoveCar = function () {
            this.myCarContainer.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.moveCarBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveCar, this);
        };
        /**禁止车子滑动*/
        GameContainer.prototype.disableMoveCar = function () {
            this.myCarContainer.touchEnabled = false;
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.moveCarBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveCar, this);
        };
        /**创建礼物*/
        GameContainer.prototype.createGift = function () {
            var giftX;
            if (this.mySanta.direction == 'left') {
                giftX = this.stageW - this.mySanta.width + this.mySanta.getSantaX() + 210;
            }
            else {
                giftX = this.stageW - this.mySanta.width + this.mySanta.getSantaX() + 60;
            }
            if (giftX + 70 > 0 && giftX < this.stageW + 70) {
                var gift = Game.Gift.produce();
                gift.x = giftX;
                gift.y = 220;
                this.addChild(gift);
                this.allGifts.push(gift);
            }
        };
        /**更新战绩*/
        GameContainer.prototype.setScore = function () {
            this.bannerContainer.setScore(this.curScore);
        };
        /**更新战绩动画*/
        GameContainer.prototype.setScoreAnimation = function (score) {
            //显示分数
            var scoreText = score > 0 ? '+' + score.toString() : score.toString();
            var scoreX;
            var scoreY;
            var scoreAnimate;
            var text;
            text = Game.ScoreText.produce(scoreText);
            this.addChild(text);
            scoreX = this.myCarContainer.x + this.myCar.width - 50;
            scoreY = this.myCarContainer.y - 30;
            text.x = scoreX;
            text.y = scoreY;
            scoreAnimate = egret.Tween.get(text);
            scoreAnimate.to({ x: scoreX, y: scoreY - 50 }, 500).call(this.scoreAnimationEnd, this);
            this.scoreTextArr.push(text);
            //显示发光
            egret.Tween.removeTweens(this.catchlight);
            egret.Tween.get(this.catchlight).to({ alpha: 1 }, 200).to({ alpha: 0 }, 200);
        };
        GameContainer.prototype.scoreAnimationEnd = function () {
            var delScoreText = this.scoreTextArr.shift();
            egret.Tween.removeTweens(delScoreText);
            Game.ScoreText.reclaim(delScoreText);
            this.removeChild(delScoreText);
        };
        /**创建飘雪*/
        GameContainer.prototype.createSnow = function () {
            var snow = Game.Snow.produce();
            var snowX;
            var snowMoveTime = 10000;
            snowX = Math.random() * this.stageW;
            snow.x = snowX;
            if (this.allSnow.length < this.preCreatSnow) {
                snow.y = Math.random() * this.stageH;
                snowMoveTime = (this.stageH - snow.y) * 10;
            }
            else {
                snow.y = -20;
            }
            this.addChild(snow);
            this.allSnow.push(snow);
            //飘雪动作
            egret.Tween.removeTweens(snow);
            egret.Tween.get(snow).to({ x: snow.x + (Math.random() - 0.5) * this.stageW, y: this.stageH + 20 }, snowMoveTime).call(this.snowAnimationEnd, this);
        };
        /**消除飘雪*/
        GameContainer.prototype.snowAnimationEnd = function () {
            var snow = this.allSnow.shift();
            egret.Tween.removeTweens(snow);
            Game.Snow.reclaim(snow);
            this.removeChild(snow);
        };
        /**游戏开始*/
        GameContainer.prototype.gameStart = function () {
            //判断是否还有机会
            if (this.times <= 0) {
                this.sharePanel = new Game.SharePanel();
                this.sharePanel.width = this.stageW;
                this.sharePanel.height = this.stageH;
                this.sharePanel.anchorX = this.sharePanel.anchorY = 0.5;
                this.sharePanel.x = this.stageW / 2;
                this.sharePanel.y = this.stageH / 2;
                this.sharePanel.scaleX = this.sharePanel.scaleY = 0;
                this.sharePanel.touchEnabled = true;
                this.sharePanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeSharePanel, this);
                this.addChild(this.sharePanel);
                egret.Tween.get(this.sharePanel).to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backOut).call(this.sharePanelShowFinish, this);
            }
            else {
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
                if (this.btnStart.parent) {
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
        };
        /**游戏画面更新*/
        GameContainer.prototype.gameViewUpdate = function () {
            //游戏时间机制
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this.lastTime);
            this.lastTime = nowTime;
            var speedOffset = 60 / fps;
            var i = 0;
            //礼物
            var giftCount = this.allGifts.length;
            var curGift;
            var giftY;
            var delGift = [];
            var curDelGift;
            //更新时间轴和分数
            this.bannerContainer.updateBanner(speedOffset);
            //更新圣诞老人位置
            this.mySanta.updateSanta(speedOffset);
            for (i = 0; i < giftCount; i++) {
                curGift = this.allGifts[i];
                giftY = curGift.y;
                giftY += curGift.score * this.speed;
                curGift.y = giftY;
                if (giftY > this.stageH) {
                    delGift.push(curGift);
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
        };
        /**基于矩形的碰撞检测*/
        GameContainer.prototype.judgeHitTest = function (obj1, obj2) {
            var rect1 = obj1.getBounds();
            var rect2 = obj2.bounds;
            rect1.x = this.myCarContainer.x; //本该为obj1的
            rect1.y = this.myCarContainer.y; //本该为obj1的
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            return rect1.intersects(rect2);
        };
        /**检测碰撞*/
        GameContainer.prototype.gameHitTest = function () {
            var i = 0;
            var car = this.myCar;
            var gifts = this.allGifts;
            var giftLen = gifts.length;
            for (i = 0; i < giftLen; i++) {
                var curDelGift = gifts[i];
                if (curDelGift && this.judgeHitTest(car, curDelGift)) {
                    //console.log('hit')
                    var score = curDelGift.score;
                    if (curDelGift.giftTypeIdx == 0) {
                        score = -1 * score;
                    }
                    this.curScore += score;
                    if (this.curScore <= 0) {
                        this.curScore = 0;
                    }
                    this.setScore();
                    this.setScoreAnimation(score);
                    Game.Gift.reclaim(curDelGift);
                    this.removeChild(curDelGift);
                    this.allGifts.splice(this.allGifts.indexOf(curDelGift), 1);
                }
            }
        };
        /**游戏结束*/
        GameContainer.prototype.gameStop = function () {
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
        };
        GameContainer.prototype.gameReStart = function () {
            this.scorePanel.removeEventListener('gameReStart', this.gameReStart, this);
            if (this.scorePanel.parent && this.times > 0) {
                this.scorePanel.clearAnimation();
                this.removeChild(this.scorePanel);
            }
            this.gameStart();
        };
        GameContainer.prototype.scorePanelShowFinish = function () {
            egret.Tween.removeTweens(this.scorePanel);
        };
        GameContainer.prototype.closeSharePanel = function () {
            this.sharePanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeSharePanel, this);
            if (this.scorePanel) {
                this.scorePanel.addEventListener('gameReStart', this.gameReStart, this);
            }
            if (this.sharePanel.parent) {
                this.removeChild(this.sharePanel);
            }
        };
        GameContainer.prototype.sharePanelShowFinish = function () {
            egret.Tween.removeTweens(this.sharePanel);
        };
        GameContainer.prototype.postGameStartComplete = function (event) {
            console.log(this.postGameStart.data);
            this.random_key = this.postGameStart.data.data;
        };
        GameContainer.prototype.postScoreComplete = function () {
            //post完成后执行下面代码
            //console.log(this.postScore.data);
            //隐藏loading
            this.ajaxLoading.stop();
            this.removeChild(this.ajaxLoading);
            if (window["postScoreCompleteData"]["error_code"] != 0) {
                alert(window["postScoreCompleteData"]["error_msg"]);
                setTimeout(function () {
                    //window.location.href = window.location.href;
                }, 1000);
            }
            else {
                //更新玩家信息
                this.times--;
                this.maxScore = window["postScoreCompleteData"].data.Score;
                this.maxRank = window["postScoreCompleteData"].data.Rank;
                //this.maxScore = this.postScore.data.Score;
                //this.maxRank = this.postScore.data.Rank;
                changeShareText(this.maxScore);
                //显示成绩
                this.scorePanel = new Game.ScorePanel({
                    times: this.times,
                    maxScore: this.maxScore,
                    curScore: this.curScore,
                    maxRank: this.maxRank
                });
                this.scorePanel.width = this.stageW;
                this.scorePanel.height = this.stageH;
                this.scorePanel.anchorX = this.scorePanel.anchorY = 0.5;
                this.scorePanel.x = this.stageW / 2;
                this.scorePanel.y = this.stageH / 2;
                this.scorePanel.scaleX = this.scorePanel.scaleY = 0;
                this.scorePanel.addEventListener('gameReStart', this.gameReStart, this);
                this.addChild(this.scorePanel);
                egret.Tween.get(this.scorePanel).to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backOut).call(this.scorePanelShowFinish, this);
            }
        };
        GameContainer.prototype.checkRequest = function () {
            if (window["IsRequestComplete"] == true) {
                this.requestTimer.stop();
                this.requestTimer.removeEventListener(egret.TimerEvent.TIMER, this.checkRequest, this);
                this.postScoreComplete();
            }
        };
        GameContainer.prototype.init = function () {
            var x = 0;
            var fn = function (e) {
                x += e.gamma;
                this.myCarContainer.x = x;
            };
            window.removeEventListener('deviceorientation', fn, true);
            window.addEventListener('deviceorientation', fn, true);
        };
        return GameContainer;
    })(egret.DisplayObjectContainer);
    Game.GameContainer = GameContainer;
})(Game || (Game = {}));
