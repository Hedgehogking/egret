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
     * 胜利
     */
    var FailPanel = (function (_super) {
        __extends(FailPanel, _super);
        function FailPanel() {
            _super.call(this);
            var bg = this.createBitmapByName("failed_bg"); //开始按钮
            this.tap_textfeild = new egret.TextField();
            this.tap_textfeild.width = 400;
            this.tap_textfeild.textColor = 0xff0000;
            this.tap_textfeild.textAlign = egret.HorizontalAlign.CENTER;
            this.tap_textfeild.text = "你没有抓住神！经！猫！！";
            this.tap_textfeild.size = 22;
            this.tap_textfeild.x = 20;
            this.tap_textfeild.y = 190;
            this.rank_textfeild = new egret.TextField();
            this.rank_textfeild.width = 400;
            this.rank_textfeild.textColor = 0xffffff;
            this.rank_textfeild.textAlign = egret.HorizontalAlign.CENTER;
            this.rank_textfeild.text = "精神病院长又发神经病了！";
            this.rank_textfeild.size = 22;
            this.rank_textfeild.strokeColor = 0x000000;
            this.rank_textfeild.stroke = 2;
            this.rank_textfeild.x = 20;
            this.rank_textfeild.y = 230;
            this.share_btn = this.createBitmapByName("share_btn"); //开始按钮
            this.share_btn.x = 10;
            this.share_btn.y = bg.height + 20;
            this.share_btn.touchEnabled = true; //开启触碰
            this.share_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doShare, this); //点击按钮开始游戏
            this.replay_btn = this.createBitmapByName("replay_btn"); //开始按钮
            this.replay_btn.x = 220;
            this.replay_btn.y = bg.height + 20;
            this.replay_btn.touchEnabled = true; //开启触碰
            this.replay_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doRepaly, this); //点击按钮开始游戏
            this.mao2_btn = this.createBitmapByName("mao2"); //开始按钮
            this.mao2_btn.x = 90;
            this.mao2_btn.y = bg.height - 80;
            this.mao2_btn.touchEnabled = true; //开启触碰
            this.mao2_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doJump, this); //点击按钮开始游戏
            this.addChild(bg);
            this.addChild(this.tap_textfeild);
            this.addChild(this.rank_textfeild);
            this.addChild(this.share_btn);
            this.addChild(this.replay_btn);
            this.addChild(this.mao2_btn);
        }
        FailPanel.prototype.score = function (n) {
            this.tap_textfeild.text = "您用" + n + "步都没有抓住神经猫";
        };
        FailPanel.prototype.doShare = function (evt) {
            this.dispatchEventWith("shareEvent");
        };
        FailPanel.prototype.doRepaly = function (evt) {
            this.dispatchEventWith("replayEvent");
        };
        FailPanel.prototype.doJump = function (evt) {
            jumpToMao2();
        };
        FailPanel.prototype.createBitmapByName = function (name) {
            var result = new egret.Bitmap();
            var texture = RES.getRes(name);
            result.texture = texture;
            return result;
        };
        return FailPanel;
    })(egret.Sprite);
    catgame.FailPanel = FailPanel;
    FailPanel.prototype.__class__ = "catgame.FailPanel";
})(catgame || (catgame = {}));
