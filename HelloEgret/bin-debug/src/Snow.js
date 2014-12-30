var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Snow = (function (_super) {
        __extends(Snow, _super);
        function Snow() {
            _super.call(this);
            this.graphics.beginFill(0xffffff, Math.random() * 0.7 + 0.3);
            this.graphics.drawCircle(0, 0, Game.Snow.randomR());
            this.graphics.endFill();
        }
        Snow.produce = function () {
            var dict = Game.Snow.cacheDict;
            var snow;
            if (dict.length > 0) {
                snow = dict.shift();
            }
            else {
                snow = new Game.Snow();
            }
            return snow;
        };
        Snow.reclaim = function (snow) {
            var dict = Game.Snow.cacheDict;
            if (dict.indexOf(snow) == -1) {
                dict.push(snow);
            }
        };
        Snow.randomR = function () {
            return Math.random() * 4 + 1;
        };
        //飘雪的生产与回收对象池
        Snow.cacheDict = [];
        return Snow;
    })(egret.Shape);
    Game.Snow = Snow;
    Snow.prototype.__class__ = "Game.Snow";
})(Game || (Game = {}));
