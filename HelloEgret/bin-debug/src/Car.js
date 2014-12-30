var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Car = (function (_super) {
        __extends(Car, _super);
        function Car() {
            _super.call(this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        Car.prototype.onAddToStage = function () {
            this.car = new egret.Bitmap(RES.getRes('car'));
            this.addChild(this.car);
        };
        return Car;
    })(egret.DisplayObjectContainer);
    Game.Car = Car;
    Car.prototype.__class__ = "Game.Car";
})(Game || (Game = {}));
