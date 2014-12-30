var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Administrator on 2014/12/23.
 */
var Snow = (function (_super) {
    __extends(Snow, _super);
    function Snow() {
        _super.call(this);
        this.allCicle = [];
        this.cicleInterval = 100;
        this.preCreateNum = 60;
        this.cicleGoDownTime = 10000;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    Snow.prototype.onAddToStage = function () {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        var i = 0;
        for (i = 0; i < this.preCreateNum; i++) {
            this.creatCicle();
        }
        var cicleTimer = new egret.Timer(this.cicleInterval);
        cicleTimer.addEventListener(egret.TimerEvent.TIMER, this.creatCicle, this);
        cicleTimer.start();
    };
    Snow.prototype.creatCicle = function () {
        var cicle = Cicle.produce();
        cicle.x = Math.random() * this.stageW;
        if (this.allCicle.length >= this.preCreateNum) {
            cicle.y = -20;
        }
        else {
            cicle.y = Math.random() * this.stageH;
        }
        this.allCicle.push(cicle);
        this.addChild(cicle);
        var gotoX = cicle.x + (Math.random() - 0.5) * this.stageW;
        var gotoY = this.stageH + 20;
        var time = this.cicleGoDownTime - cicle.y / ((this.stageH + 40) / this.cicleGoDownTime);
        egret.Tween.get(cicle).to({ x: gotoX, y: gotoY }, time).call(this.cicleAnimationEnd, this, [cicle]);
    };
    Snow.prototype.cicleAnimationEnd = function (cicle) {
        this.allCicle.splice(this.allCicle.indexOf(cicle), 1);
        egret.Tween.removeTweens(cicle);
        Cicle.reclaim(cicle);
        this.removeChild(cicle);
    };
    return Snow;
})(egret.DisplayObjectContainer);
Snow.prototype.__class__ = "Snow";
var Cicle = (function (_super) {
    __extends(Cicle, _super);
    function Cicle() {
        _super.call(this);
        this.graphics.beginFill(0xffffff, Math.random() * 0.7 + 0.3);
        this.graphics.drawCircle(0, 0, Math.random() * 4 + 1);
        this.graphics.endFill();
    }
    Cicle.produce = function () {
        var cicle;
        if (Cicle.cacheDict.length > 0) {
            cicle = Cicle.cacheDict.shift();
        }
        else {
            cicle = new Cicle();
        }
        return cicle;
    };
    Cicle.reclaim = function (cicle) {
        if (Cicle.cacheDict.indexOf(cicle) == -1) {
            Cicle.cacheDict.push(cicle);
        }
    };
    Cicle.cacheDict = [];
    return Cicle;
})(egret.Shape);
Cicle.prototype.__class__ = "Cicle";
