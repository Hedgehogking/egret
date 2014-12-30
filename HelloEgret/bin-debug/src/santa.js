var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Santa = (function (_super) {
        __extends(Santa, _super);
        function Santa() {
            _super.call(this);
            //圣诞老人移动方向
            this.direction = 'left';
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        Santa.prototype.onAddToStage = function () {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var santaPng = RES.getRes('santa_png');
            var santaJson = RES.getRes('santa_json');
            this.santa = new egret.MovieClip(santaJson, santaPng);
            this.santa.frameRate = 3;
            this.addChild(this.santa);
        };
        Santa.prototype.init = function () {
            this.direction = 'left';
            this.santa.anchorX = 0;
            this.santa.scaleX = 1;
            this.santa.x = 0;
        };
        Santa.prototype.start = function () {
            this.santa.gotoAndPlay('santa');
        };
        Santa.prototype.stop = function () {
            this.santa.gotoAndStop('santa');
        };
        Santa.prototype.updateSanta = function (speedOffset) {
            if (this.direction == 'left') {
                if (this.santa.x + (this.stageW - this.santa.width + 185) < 0) {
                    this.direction = 'right';
                    this.santa.anchorX = 1;
                    this.santa.scaleX = -1;
                    this.santa.x += speedOffset * 6;
                }
                else {
                    this.santa.x -= speedOffset * 6;
                }
            }
            else {
                if (this.santa.x > 185) {
                    this.direction = 'left';
                    this.santa.anchorX = 0;
                    this.santa.scaleX = 1;
                    this.santa.x -= speedOffset * 6;
                }
                else {
                    this.santa.x += speedOffset * 6;
                }
            }
        };
        Santa.prototype.getSantaX = function () {
            return this.santa.x;
        };
        return Santa;
    })(egret.DisplayObjectContainer);
    Game.Santa = Santa;
    Santa.prototype.__class__ = "Game.Santa";
})(Game || (Game = {}));
