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
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map() {
            _super.call(this);
            this.map = [];
            this.mapsize = 9; //必须奇数
            this.playTurn = true;
            this.block = 0.2;
            this.tap = 0;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        Map.prototype.onAddToStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        };
        /**初始化*/
        Map.prototype.init = function () {
            while (this.numChildren) {
                this.removeChildAt(0);
            }
            this.map = [];
            this.createMap();
            this.tap = 0;
        };
        /**创建地图**/
        Map.prototype.createMap = function () {
            var node;
            for (var i = 0; i < this.mapsize; i++) {
                this.map[i] = [];
                for (var j = 0; j < this.mapsize; j++) {
                    node = new catgame.Node(i, j);
                    node.x = i * 48 + (j % 2) * 24;
                    node.y = j * 44;
                    this.map[i][j] = node;
                    node.touchEnabled = true; //开启触碰
                    node.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNodeClick, this);
                    this.addChild(node);
                    var cc = (this.mapsize - 1) / 2;
                    if (i != cc && j != cc && Math.random() < this.block) {
                        node.doFillPot();
                        node.touchEnabled = false;
                    }
                }
            }
        };
        Map.prototype.lock = function () {
            this.playTurn = false;
        };
        Map.prototype.unlock = function () {
            this.playTurn = true;
        };
        Map.prototype.getNode = function (arr) {
            return this.map[arr[0]][arr[1]];
        };
        /**node被点击**/
        Map.prototype.onNodeClick = function (evt) {
            if (!this.playTurn) {
                //console.log("猫咪回合");
                return;
            }
            this.tap = this.tap + 1;
            var node = evt.target;
            node.doFillPot();
            node.touchEnabled = false;
            node.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNodeClick, this);
            //this.showRound(node);
            this.dispatchEventWith("nodeClick");
        };
        /**显示周围6个格子**/
        Map.prototype.showRound = function (node) {
            //console.log(node.getPos());
            var pos = node.getPos();
            var arr = this.getRound(pos);
            var l = arr.length;
            var n;
            for (var i = 0; i < this.mapsize; i++) {
                for (var j = 0; j < this.mapsize; j++) {
                    if (i == pos[0] && j == pos[1]) {
                    }
                    else {
                        n = this.map[i][j];
                        n.clean();
                    }
                }
            }
            for (i = 0; i < l; i++) {
                var rnd = arr[i];
                n = this.map[rnd[0]][rnd[1]];
                n.doFillPot();
            }
        };
        /**二维坐标到点**/
        Map.prototype.coverPos2Point = function (__arr) {
            return [this.x + 48 * __arr[0] + (__arr[1] % 2) * 24, this.y + __arr[1] * 44];
        };
        /**计算周围格子**/
        Map.prototype.getRound = function (__point) {
            var xx = __point[0];
            var yy = __point[1];
            var arr;
            var ret = [];
            if (yy % 2 == 0) {
                arr = [[xx - 1, yy - 1], [xx - 1, yy], [xx - 1, yy + 1], [xx, yy + 1], [xx + 1, yy], [xx, yy - 1]];
            }
            else {
                arr = [[xx, yy - 1], [xx - 1, yy], [xx, yy + 1], [xx + 1, yy + 1], [xx + 1, yy], [xx + 1, yy - 1]];
            }
            for (var i = 0; i < 6; i++) {
                var rnd = arr[i];
                if (rnd[0] >= 0 && rnd[1] >= 0 && rnd[0] < this.mapsize && rnd[1] < this.mapsize) {
                    ret.push(rnd);
                }
            }
            return ret;
        };
        /**计算寻路,泛洪计算,可优化**/
        Map.prototype.findPath = function (__from) {
            //清理其他的格子
            var node;
            for (var i = 0; i < this.mapsize; i++) {
                for (var j = 0; j < this.mapsize; j++) {
                    node = this.map[i][j];
                    node.clean();
                }
            }
            node = this.findNode(__from);
            var path = [];
            if (node) {
                while (node.prenode) {
                    path.push(node.getPos());
                    node = node.prenode;
                }
            }
            else {
                //
                console.log("已经被困随便走一步");
                this.dispatchEventWith("weizhu");
                //随便走一步
                path = this.getNear(__from);
            }
            return path.reverse();
        };
        Map.prototype.randomSort = function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            return -1;
        };
        Map.prototype.findNode = function (__from) {
            var used = [__from]; //已经覆盖的点
            var next = [__from]; //下一轮可以走的点
            var flag = true;
            var around;
            //around = this.getRound(__from.getPos());
            var i = 0;
            var l = 0;
            var j = 0;
            var k = 0;
            var node; //当前中心点
            var tnode; //当前周围点
            while (flag) {
                l = next.length;
                //console.log("寻路中..." + l);
                if (l == 0) {
                    flag = false;
                    return null; //无解
                }
                var tnext = [];
                for (i = 0; i < l; i++) {
                    node = next.shift();
                    around = this.getRound(node.getPos());
                    k = around.length;
                    for (j = 0; j < k; j++) {
                        var rnd = around[j];
                        tnode = this.map[rnd[0]][rnd[1]];
                        if (tnode.isFill()) {
                            used.push(tnode);
                            continue;
                        }
                        if (used.indexOf(tnode) > -1 || next.indexOf(tnode) > -1) {
                            continue;
                        }
                        tnode.prenode = node;
                        if (this.isExit(tnode)) {
                            //console.log("找到出口，最短路径")
                            return tnode; //最短路径
                        }
                        tnext.push(tnode);
                    }
                    used.push(node);
                }
                next = tnext;
            }
        };
        /**获得可走的点**/
        Map.prototype.getNear = function (__node) {
            var pos = __node.getPos();
            var arr = this.getRound(pos);
            var l = arr.length;
            for (var i = 0; i < l; i++) {
                if (!this.getNode(arr[i]).isFill()) {
                    return [arr[i]];
                }
            }
            return [];
        };
        /**是否是出口**/
        Map.prototype.isExit = function (__node) {
            var sd = __node.getPos();
            if (sd[0] == 0 || sd[1] == 0 || sd[0] == this.mapsize - 1 || sd[1] == this.mapsize - 1) {
                return true;
            }
            return false;
        };
        return Map;
    })(egret.DisplayObjectContainer);
    catgame.Map = Map;
    Map.prototype.__class__ = "catgame.Map";
})(catgame || (catgame = {}));
