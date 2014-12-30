var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game;
(function (Game) {
    var Gift = (function (_super) {
        __extends(Gift, _super);
        function Gift(texture) {
            _super.call(this, texture);
        }
        Gift.produce = function () {
            var giftTypeIdx = Math.floor(Math.random() * Game.Gift.giftTypeArr.length);
            var giftType = Game.Gift.giftTypeArr[giftTypeIdx];
            if (Game.Gift.cacheDict[giftType] == null) {
                Game.Gift.cacheDict[giftType] = [];
            }
            var dict = Game.Gift.cacheDict[giftType];
            var gift;
            if (dict.length > 0) {
                gift = dict.shift();
            }
            else {
                gift = new Game.Gift(RES.getRes(giftType));
            }
            gift.giftType = giftType;
            gift.giftTypeIdx = giftTypeIdx;
            gift.score = Game.Gift.getGiftRandomScore();
            gift.bounds = gift.getBounds();
            return gift;
        };
        Gift.reclaim = function (gift) {
            var giftType = gift.giftType;
            if (Game.Gift.cacheDict[giftType] == null) {
                Game.Gift.cacheDict[giftType] = [];
            }
            var dict = Game.Gift.cacheDict[giftType];
            if (dict.indexOf(gift) == -1) {
                Game.Gift.cacheDict[giftType].push(gift);
            }
        };
        Gift.getGiftRandomScore = function () {
            return Math.floor(this.minScore + Math.random() * (this.maxScore - this.minScore));
        };
        //游戏机制
        Gift.giftTypeArr = ['gift1', 'gift2', 'gift3', 'gift4', 'gift5']; //礼物种类
        Gift.minScore = 10; //礼物最低分数
        Gift.maxScore = 50; //礼物最高分数
        //礼物的生产与回收对象池
        Gift.cacheDict = {};
        return Gift;
    })(egret.Bitmap);
    Game.Gift = Gift;
    Gift.prototype.__class__ = "Game.Gift";
})(Game || (Game = {}));
