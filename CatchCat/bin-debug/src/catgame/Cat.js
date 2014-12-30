var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by zen on 14-7-13.
 */
var catgame;
(function (catgame) {
    /**
     * 猫
     */
    var Cat = (function (_super) {
        __extends(Cat, _super);
        function Cat() {
            _super.call(this);
            this.isWeizhu = false;
            var data = RES.getRes("stay_json");
            var texture = RES.getRes("stay_png");
            this.standmc = new egret.MovieClip(data, texture);
            this.standmc.setInterval(3);
            this.standmc.gotoAndPlay("stay");
            data = RES.getRes("weizhu_json");
            texture = RES.getRes("weizhu_png");
            this.weizhumc = new egret.MovieClip(data, texture);
            this.weizhumc.setInterval(3);
            this.weizhumc.gotoAndPlay("weizhu");
            this.anchorX = 0.5;
            this.anchorY = 1;
            this.stay();
        }
        Cat.prototype.init = function () {
            this.isWeizhu = false;
            this.stay();
        };
        /**走一步 , 行走动画啥的**/
        Cat.prototype.run = function (pos) {
            this.x = pos[0];
            this.y = pos[1];
            this.dispatchEventWith("catRun");
        };
        /**站定**/
        Cat.prototype.stay = function () {
            if (this.numChildren) {
                this.removeChildAt(0);
            }
            if (this.isWeizhu) {
                this.addChild(this.weizhumc);
            }
            else {
                this.addChild(this.standmc);
            }
        };
        Cat.prototype.weizhu = function () {
            this.isWeizhu = true;
            this.stay();
        };
        /**成功动画**/
        Cat.prototype.successShow = function () {
        };
        /**失败动画**/
        Cat.prototype.failShow = function () {
        };
        return Cat;
    })(egret.Sprite);
    catgame.Cat = Cat;
    Cat.prototype.__class__ = "catgame.Cat";
})(catgame || (catgame = {}));
