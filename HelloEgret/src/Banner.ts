module Game {
    export class Banner extends egret.DisplayObjectContainer {
        private stageW:number;

        //颜色覆盖条
        private bannerColorCover:egret.Bitmap;
        private colorBarMaxX:number;
        private colorBarMinX:number;
        private colorBarW:number;

        //分数
        private textPlayerName:egret.TextField;
        private textMaxScore:egret.TextField;
        private textCurScore:egret.TextField;

        //游戏机制
        private everyDecreaseX:number;


        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        private onAddToStage():void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;

            this.setBannerDisplay();

        }

        private setBannerDisplay():void {
            //颜色条外框
            var colorLineContainer = new egret.DisplayObjectContainer;
            colorLineContainer.width = this.stageW * 0.9;
            colorLineContainer.height = 30;
            colorLineContainer.x = (this.stageW - colorLineContainer.width) / 2;
            colorLineContainer.y = 14;
            this.addChild(colorLineContainer);
            var colorLineRect:egret.Rectangle = new egret.Rectangle(0, 0, colorLineContainer.width, colorLineContainer.height);
            colorLineContainer.mask = colorLineRect;

            //颜色条背景
            var bannerColor:egret.Bitmap = new egret.Bitmap(RES.getRes("bannerColor"));
            bannerColor.x = -30;
            bannerColor.y = 0;
            colorLineContainer.addChild(bannerColor);

            //颜色覆盖条
            this.bannerColorCover = new egret.Bitmap(RES.getRes("bannerColorCover"));
            this.colorBarMaxX = this.stageW * 0.9 - 36;
            this.colorBarMinX = -32;
            this.colorBarW = this.colorBarMaxX - this.colorBarMinX;
            this.bannerColorCover.x = this.colorBarMaxX;
            this.bannerColorCover.y = -1;
            colorLineContainer.addChild(this.bannerColorCover);

            //banner背景
            var bannerBg:egret.Bitmap = new egret.Bitmap(RES.getRes("bannerBg"));
            this.addChild(bannerBg);

            //玩家姓名
            this.textPlayerName = new egret.TextField();
            this.textPlayerName.x = 70;
            this.textPlayerName.width = 155;
            this.addChild(this.textPlayerName);

            //玩家最高分数
            this.textMaxScore = new egret.TextField();
            this.textMaxScore.x = 307;
            this.textMaxScore.width = 100;
            this.addChild(this.textMaxScore);

            //玩家当前分数
            this.textCurScore = new egret.TextField();
            this.textCurScore.x = 493;
            this.textCurScore.width = 100;
            this.addChild(this.textCurScore);

            this.textPlayerName.y = this.textMaxScore.y = this.textCurScore.y = 64;
            this.textPlayerName.size = this.textMaxScore.size = this.textCurScore.size = 27;
            this.textPlayerName.textAlign = this.textMaxScore.textAlign = this.textCurScore.textAlign = 'right';
        }

        public setBannerInfo(name:string, maxScore:number, curScore:number):void {
            this.textPlayerName.text = name;
            this.textMaxScore.text = maxScore.toString();
            this.textCurScore.text = curScore.toString();
        }

        public init(totalTime:number):void {
            this.bannerColorCover.x = this.colorBarMaxX;
            this.everyDecreaseX = this.colorBarW / (totalTime * 60);
        }

        public start():void {
        }

        public stop():void {
        }

        public setScore(score:number):void {
            this.textCurScore.text = score.toString();
        }

        public updateBanner(speedOffset:number):void {
            this.bannerColorCover.x -= speedOffset * this.everyDecreaseX;
        }


    }

}