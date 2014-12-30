var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text) {
            _super.call(this);
            this.text = text;
            this.fontFamily = '微软雅黑';
            this.bold = true;
            this.textAlign = 'center';
        }
        return Text;
    })(egret.TextField);
    Game.Text = Text;
    Text.prototype.__class__ = "Game.Text";
})(Game || (Game = {}));
