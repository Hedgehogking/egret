/**
 * Created by zen on 14-7-13.
 */
module catgame
{
    /**
     * 胜利
     */
    export class FailPanel extends egret.Sprite
    {
    	private tap_textfeild : egret.TextField;
    	private rank_textfeild : egret.TextField;
    	private beat_textfeild : egret.TextField;
    	private title_textfeild : egret.TextField;
        private share_btn:egret.Bitmap;
        private replay_btn:egret.Bitmap;
        private mao2_btn:egret.Bitmap;
    	public constructor() {
            super();
            var bg = this.createBitmapByName("failed_bg");//开始按钮
            this.tap_textfeild= new egret.TextField();
	        this.tap_textfeild.width = 400;
	        this.tap_textfeild.textColor = 0xff0000;
        	this.tap_textfeild.textAlign = egret.HorizontalAlign.CENTER;
	        this.tap_textfeild.text = "你没有抓住神！经！猫！！";
	        this.tap_textfeild.size = 22;
	        this.tap_textfeild.x = 20;
	        this.tap_textfeild.y = 190;

	        this.rank_textfeild= new egret.TextField();
	        this.rank_textfeild.width = 400;
	        this.rank_textfeild.textColor = 0xffffff;
        	this.rank_textfeild.textAlign = egret.HorizontalAlign.CENTER;
	        this.rank_textfeild.text = "精神病院长又发神经病了！";
	        this.rank_textfeild.size = 22;
        	this.rank_textfeild.strokeColor = 0x000000;
        	this.rank_textfeild.stroke = 2;
	        this.rank_textfeild.x = 20;
	        this.rank_textfeild.y = 230;

	       


	        this.share_btn = this.createBitmapByName("share_btn");//开始按钮
            this.share_btn.x = 10
            this.share_btn.y = bg.height + 20;
            this.share_btn.touchEnabled = true;//开启触碰
            this.share_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.doShare,this);//点击按钮开始游戏
            
	        this.replay_btn = this.createBitmapByName("replay_btn");//开始按钮
            this.replay_btn.x = 220
            this.replay_btn.y = bg.height + 20;
            this.replay_btn.touchEnabled = true;//开启触碰
            this.replay_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.doRepaly,this);//点击按钮开始游戏

            this.mao2_btn = this.createBitmapByName("mao2");//开始按钮
            this.mao2_btn.x = 90
            this.mao2_btn.y = bg.height - 80;
            this.mao2_btn.touchEnabled = true;//开启触碰
            this.mao2_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.doJump,this);//点击按钮开始游戏

            this.addChild(bg);
	        this.addChild(this.tap_textfeild);
	        this.addChild(this.rank_textfeild);
	        this.addChild(this.share_btn);
            this.addChild(this.replay_btn);
            this.addChild(this.mao2_btn);
        }

        public score(n : number){
        	this.tap_textfeild.text = "您用"+n+"步都没有抓住神经猫";
        }

        public doShare(evt:egret.TouchEvent):void{
      		this.dispatchEventWith("shareEvent");
        }

        public doRepaly(evt:egret.TouchEvent):void{
      		this.dispatchEventWith("replayEvent");
        }

        
        public doJump(evt:egret.TouchEvent):void{
            jumpToMao2();
        }

        private createBitmapByName(name:string):egret.Bitmap {
            var result:egret.Bitmap = new egret.Bitmap();
            var texture:egret.Texture = RES.getRes(name);
            result.texture = texture;
            return result;
        }
    }
}