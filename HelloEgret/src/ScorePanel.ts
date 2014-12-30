module Game{
    export class ScorePanel extends egret.Sprite{
        private stageH:number;
        private stageW:number;
        private rotateLight:egret.Bitmap;

        //玩家数据
        private times:number = 0;
        private maxScore:number = 0;
        private curScore:number = 0;
        private maxRank:number = 0;

        public constructor(playerData:Object){
            super();
            this.times = playerData["times"];
            this.maxScore = playerData["maxScore"];
            this.curScore = playerData["curScore"];
            this.maxRank = playerData["maxRank"];
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }

        private onAddToStage():void{
            this.stageH = this.stage.stageHeight;
            this.stageW = this.stage.stageWidth;


            //黑色半透明背景
            var panelBg:egret.Shape = new egret.Shape();
            panelBg.graphics.beginFill(0x000000,.3);
            panelBg.graphics.drawRect(0,0,this.stageW,this.stageH);
            panelBg.graphics.endFill();
            this.addChild(panelBg);


            //旋转光芒
            this.rotateLight = new egret.Bitmap(RES.getRes('img_sharelight_640x600'));
            this.rotateLight.anchorX = this.rotateLight.anchorY = 0.5;
            this.rotateLight.x = this.stageW / 2;
            this.rotateLight.y = 400;
            egret.Tween.get(this.rotateLight,{loop:true}).to({rotation:360},10000);
            this.addChild(this.rotateLight);


            //星星
            var star:egret.Bitmap = new egret.Bitmap(RES.getRes('img_sharestar_560x500'));
            this.addChild(star);
            star.x = (this.stageW - star.width) / 2;
            star.y = 150;


            //成绩的背景
            var scoreBg:egret.Bitmap = new egret.Bitmap(RES.getRes('img_over_410x420'));
            this.addChild(scoreBg);
            scoreBg.x = (this.stageW - scoreBg.width) / 2;
            scoreBg.y = 200;


            //成绩标题文字
            var title:Game.Text = new Game.Text('SCORE');
            title.width = 160;
            title.x = (this.stageW - title.width) / 2;
            title.y = 280;
            this.addChild(title);


            //成绩
            var score:Game.Text = new Game.Text(this.curScore.toString());/**传参*/
            score.textColor = 0xF7E656;
            score.size = 60;
            score.width = 170;
            score.x = (this.stageW - score.width) / 2;
            score.y = 330;
            this.addChild(score);


            //排名文字
            var rank:Game.Text = new Game.Text(window["lanLib"]["scorepanel_rank"] + '：' + this.maxRank.toString());/**传参*/
            rank.width = 270;
            rank.x = (this.stageW - rank.width) / 2;
            rank.y = 420;
            this.addChild(rank);


            //最高分文字
            var highestScore:Game.Text = new Game.Text(window["lanLib"]["scorepanel_highest"] + '：' + this.maxScore.toString());/**传参*/
            highestScore.width = 270;
            highestScore.x = (this.stageW - rank.width) / 2;
            highestScore.y = 460;
            this.addChild(highestScore);


            //剩余机会文字
            var chance1:Game.Text = new Game.Text(window["lanLib"]["scorepanel_chance1"]);
            chance1.width = 150;
            chance1.x = 122;
            chance1.y = 530;
            chance1.textAlign = 'right';
            this.addChild(chance1);
            var chance2:Game.Text = new Game.Text(window["lanLib"]["scorepanel_chance2"]);
            chance2.width = 150;
            chance2.x = 330;
            chance2.y = 530;
            chance2.textAlign = 'left';
            this.addChild(chance2);
            var chance3:Game.Text = new Game.Text(this.times.toString());/**传参*/
            chance3.textColor = 0xF7E656;
            chance3.size = 40;
            chance3.width = 50;
            chance3.x = 277;
            chance3.y = 525;
            this.addChild(chance3);


            //跳转到排行榜
            var rankBg:egret.Shape = new egret.Shape();
            rankBg.graphics.beginFill(0x700E1B,1);
            rankBg.graphics.drawRoundRect(35,750,250,130,12);
            rankBg.graphics.endFill();
            this.addChild(rankBg);
            //排行榜图片
            var rankImg:egret.Bitmap = new egret.Bitmap(RES.getRes('img_rank_260x120'));
            rankImg.x = 30;
            rankImg.y = 645;
            this.addChild(rankImg);
            //排行榜按钮
            var btnRank:Game.Button;
            btnRank = new Game.Button(window["lanLib"]["scorepanel_btn_rank"]);
            btnRank.x = 46;
            btnRank.y = 771;
            btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goToRank, this);
            this.addChild(btnRank);


            //再玩一次
            var againBg:egret.Shape = new egret.Shape();
            againBg.graphics.beginFill(0x700E1B,1);
            againBg.graphics.drawRoundRect(355,750,250,130,12);
            againBg.graphics.endFill();
            this.addChild(againBg);
            //车子图片
            var againImg:egret.Bitmap = new egret.Bitmap(RES.getRes('img_again_260x100'));
            againImg.x = 350;
            againImg.y = 665;
            this.addChild(againImg);
            //开始按钮
            var btnRestart:Game.Button;
            btnRestart = new Game.Button(window["lanLib"]["scorepanel_btn_restart"]);
            btnRestart.x = 366;
            btnRestart.y = 771;
            btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
            this.addChild(btnRestart);
        }

        private gameStart():void{
            //事件调度
            this.dispatchEventWith('gameReStart');
        }

        private goToRank():void{
            window.location.href = window['params'].rankUrl;
        }

        public clearAnimation():void{
            egret.Tween.removeTweens(this.rotateLight);
        }
    }
}