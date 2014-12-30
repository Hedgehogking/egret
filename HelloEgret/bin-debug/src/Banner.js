var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Banner = (function (_super) {
        __extends(Banner, _super);
        function Banner() {
            _super.call(this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        Banner.prototype.onAddToStage = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.setBannerDisplay();
        };
        Banner.prototype.setBannerDisplay = function () {
            //颜色条外框
            var colorLineContainer = new egret.DisplayObjectContainer;
            colorLineContainer.width = this.stageW * 0.9;
            colorLineContainer.height = 30;
            colorLineContainer.x = (this.stageW - colorLineContainer.width) / 2;
            colorLineContainer.y = 14;
            this.addChild(colorLineContainer);
            var colorLineRect = new egret.Rectangle(0, 0, colorLineContainer.width, colorLineContainer.height);
            colorLineContainer.mask = colorLineRect;
            //颜色条背景
            var bannerColor = new egret.Bitmap(RES.getRes("bannerColor"));
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
            var bannerBg = new egret.Bitmap(RES.getRes("bannerBg"));
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
        };
        Banner.prototype.setBannerInfo = function (name, maxScore, curScore) {
            this.textPlayerName.text = name;
            this.textMaxScore.text = maxScore.toString();
            this.textCurScore.text = curScore.toString();
        };
        Banner.prototype.init = function (totalTime) {
            this.bannerColorCover.x = this.colorBarMaxX;
            this.everyDecreaseX = this.colorBarW / (totalTime * 60);
        };
        Banner.prototype.start = function () {
        };
        Banner.prototype.stop = function () {
        };
        Banner.prototype.setScore = function (score) {
            this.textCurScore.text = score.toString();
        };
        Banner.prototype.updateBanner = function (speedOffset) {
            this.bannerColorCover.x -= speedOffset * this.everyDecreaseX;
        };
        return Banner;
    })(egret.DisplayObjectContainer);
    Game.Banner = Banner;
    Banner.prototype.__class__ = "Game.Banner";
})(Game || (Game = {}));
