var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo2 = (function (_super) {
    __extends(Demo2, _super);
    //构造函数
    function Demo2() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.startGame, this);
    }
    //游戏启动后，会自动执行此方法
    Demo2.prototype.startGame = function () {
        this.loadResource();
    };
    //加载资源
    Demo2.prototype.loadResource = function () {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadConfig('resource/resource.json', 'resource/');
        RES.loadGroup('demo2');
    };
    //加载完执行
    Demo2.prototype.onResourceLoadComplete = function () {
        var stage = egret.MainContext.instance.stage;
        this.logo = new egret.Bitmap();
        this.logo.texture = RES.getRes('egretIcon');
        this.addChild(this.logo);
        this.startAnimation();
    };
    //动画
    Demo2.prototype.startAnimation = function () {
        var twLogo = egret.Tween.get(this.logo);
        twLogo.to({ x: 0, y: 400 }, 500).to({ x: 200, y: 400 }, 500).to({ x: 200, y: 0 }, 500).to({ x: 0, y: 0 }, 500);
        twLogo.call(this.startAnimation, this);
    };
    return Demo2;
})(egret.DisplayObjectContainer);
//# sourceMappingURL=Demo2.js.map