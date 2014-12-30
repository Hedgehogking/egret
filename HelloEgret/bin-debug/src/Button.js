var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(text) {
            _super.call(this);
            var btnBg;
            var btnText;
            btnBg = new egret.Bitmap(RES.getRes("btn_bg")); //开始按钮
            this.width = btnBg.width;
            this.height = btnBg.height;
            this.touchEnabled = true; //开启触碰
            //开始按钮文字
            btnText = new Game.Text(text);
            btnText.width = this.width;
            btnText.y = 34;
            this.addChild(btnBg);
            this.addChild(btnText);
        }
        return Button;
    })(egret.DisplayObjectContainer);
    Game.Button = Button;
    Button.prototype.__class__ = "Game.Button";
})(Game || (Game = {}));
