var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var ScoreText = (function (_super) {
        __extends(ScoreText, _super);
        function ScoreText() {
            _super.call(this);
        }
        ScoreText.produce = function (score) {
            var dict = Game.ScoreText.cacheDict;
            var scoreText;
            if (dict.length > 0) {
                scoreText = dict.shift();
            }
            else {
                scoreText = new Game.ScoreText();
            }
            scoreText.text = score;
            //scoreText.fontFamily = '微软雅黑';
            scoreText.bold = true;
            scoreText.size = 30;
            scoreText.textColor = 0xf4dc57;
            scoreText.strokeColor = 0x2e1010;
            scoreText.stroke = 2;
            return scoreText;
        };
        ScoreText.reclaim = function (scoreText) {
            var dict = Game.ScoreText.cacheDict;
            if (dict.indexOf(scoreText) == -1) {
                dict.push(scoreText);
            }
        };
        //分数的生产与回收对象池
        ScoreText.cacheDict = [];
        return ScoreText;
    })(egret.TextField);
    Game.ScoreText = ScoreText;
    ScoreText.prototype.__class__ = "Game.ScoreText";
})(Game || (Game = {}));
