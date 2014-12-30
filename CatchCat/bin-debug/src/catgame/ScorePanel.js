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
     * 成绩显示
     */
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        function ScorePanel() {
            _super.call(this);
            var g = this.graphics;
            g.beginFill(0x000000, 0.8);
            g.drawRect(0, 0, 400, 200);
            g.endFill();
            this.txt = new egret.TextField();
            this.txt.width = 400;
            this.txt.height = 200;
            this.txt.textAlign = "center";
            this.txt.textColor = 0xFFFFFF;
            this.txt.size = 24;
            this.txt.y = 60;
            this.addChild(this.txt);
        }
        ScorePanel.prototype.showScore = function (value) {
            var msg = value + "\n再来一次吧";
            this.txt.text = msg;
        };
        return ScorePanel;
    })(egret.Sprite);
    catgame.ScorePanel = ScorePanel;
    ScorePanel.prototype.__class__ = "catgame.ScorePanel";
})(catgame || (catgame = {}));
