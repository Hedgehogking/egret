var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Loading = (function (_super) {
        __extends(Loading, _super);
        function Loading() {
            _super.call(this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        Loading.prototype.onAddToStage = function () {
            this.stageH = this.stage.stageHeight;
            this.stageW = this.stage.stageWidth;
            //黑色半透明背景
            var panelBg = new egret.Shape();
            panelBg.graphics.beginFill(0x000000, .3);
            panelBg.graphics.drawRect(0, 0, this.stageW, this.stageH);
            panelBg.graphics.endFill();
            this.addChild(panelBg);
            //圣诞老人
            var santaPng = RES.getRes('santa_png');
            var santaJson = RES.getRes('santa_json');
            this.santa = new egret.MovieClip(santaJson, santaPng);
            this.santa.frameRate = 10;
            this.addChild(this.santa);
            this.santa.anchorX = this.santa.anchorY = 0.5;
            this.santa.scaleX = -1;
            this.santa.x = this.stageW / 2;
            this.santa.y = this.stageH / 2;
            //加载中文字
            var loadingText = new Game.Text(window["lanLib"]["loading_text"]); /**传参*/
            loadingText.width = 400;
            loadingText.x = (this.stageW - loadingText.width) / 2;
            loadingText.y = 600;
            this.addChild(loadingText);
            //tips文字
            //var tipsText:Game.Text = new Game.Text(window["lanLib"]["loading_tipsText"]);/**传参*/
            //tipsText.width = 500;
            //tipsText.x = (this.stageW - tipsText.width) / 2;
            //tipsText.y = 730;
            //tipsText.size = 22;
            //tipsText.bold = false;
            //this.addChild(tipsText);
        };
        Loading.prototype.play = function () {
            this.santa.gotoAndPlay('santa');
        };
        Loading.prototype.stop = function () {
            this.santa.gotoAndStop('santa');
        };
        return Loading;
    })(egret.DisplayObjectContainer);
    Game.Loading = Loading;
    Loading.prototype.__class__ = "Game.Loading";
})(Game || (Game = {}));
