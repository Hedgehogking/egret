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
     * 地图
     */
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node(__posx, __posy) {
            var texture = RES.getRes("pot1");
            this.posx = __posx;
            this.posy = __posy;
            _super.call(this, texture);
            this.anchorX = this.anchorY = 0.5;
            this.fill = false;
        }
        Node.prototype.doFillPot = function () {
            this.texture = RES.getRes("pot2");
            this.fill = true;
        };
        Node.prototype.clean = function () {
            this.prenode = null;
        };
        Node.prototype.getPos = function () {
            return [this.posx, this.posy];
        };
        Node.prototype.isFill = function () {
            return this.fill;
        };
        return Node;
    })(egret.Bitmap);
    catgame.Node = Node;
    Node.prototype.__class__ = "catgame.Node";
})(catgame || (catgame = {}));
