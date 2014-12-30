var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var BannerColor = (function (_super) {
        __extends(BannerColor, _super);
        function BannerColor() {
            _super.call(this);
            this.totalTime = 10;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        BannerColor.prototype.onAddToStage = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            //颜色条背景
            var bannerColor = new egret.Bitmap(RES.getRes("bannerColor"));
            bannerColor.x = -30;
            bannerColor.y = 0;
            this.addChild(bannerColor);
            //颜色覆盖条
            this.bannerColorCover = new egret.Bitmap(RES.getRes("bannerColorCover"));
            this.colorBarMaxX = this.stageW * 0.9 - 30;
            this.colorBarMinX = -25;
            this.colorBarW = this.colorBarMaxX - this.colorBarMinX;
            this.bannerColorCover.x = this.colorBarMaxX;
            this.bannerColorCover.y = -1;
            this.addChild(this.bannerColorCover);
            this.startTime = this.lastTime = egret.getTimer();
            this.everyDecreaseX = this.colorBarW / (this.totalTime * 60);
            //this.addEventListener(egret.Event.ENTER_FRAME, this.startTimeLine, this);
        };
        BannerColor.prototype.startTimeLine = function () {
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this.lastTime);
            this.lastTime = nowTime;
            var speedOffset = 60 / fps;
            this.bannerColorCover.x -= speedOffset * this.everyDecreaseX;
            if (this.lastTime - this.startTime > this.totalTime * 1000) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.startTimeLine, this);
                /**时间停止*/
                console.log("stop");
            }
        };
        return BannerColor;
    })(egret.DisplayObjectContainer);
    Game.BannerColor = BannerColor;
    BannerColor.prototype.__class__ = "Game.BannerColor";
})(Game || (Game = {}));
