/**
 * Created by zen on 14-7-13.
 */
module catgame
{
    /**
     * 胜利
     */
    export class SuccessPanel extends egret.Sprite
    {
    	private tap_textfeild : egret.TextField;
    	private rank_textfeild : egret.TextField;
    	private beat_textfeild : egret.TextField;
    	private title_textfeild : egret.TextField;
        private share_btn:egret.Bitmap;
        private replay_btn:egret.Bitmap;
        private mao2_btn:egret.Bitmap;
        private titles_arr:string[] = ["塞外高手","神精病博士","神经大神","你是我的小苹果","院长派来的救兵","精神病院长","扫地僧","传说中的高手","风骚的少年","白天睡觉喵","隔壁王伯伯"];
        private titles2_arr:string[] = ["神经大条","我是处女座的","停不下来","你是我的小苹果","喵了个咪的","M78星人","凤姐夫","笑而不语"];
    	public constructor() {
            super();
            var bg = this.createBitmapByName("victory_bg");//开始按钮
            this.tap_textfeild= new egret.TextField();
	        this.tap_textfeild.width = 400;
	        this.tap_textfeild.textColor = 0xff0000;
        	this.tap_textfeild.textAlign = egret.HorizontalAlign.CENTER;
	        this.tap_textfeild.text = "您用13步抓住了神经猫";
	        this.tap_textfeild.size = 22;
	        this.tap_textfeild.x = 20;
	        this.tap_textfeild.y = 140;

	        this.rank_textfeild= new egret.TextField();
	        this.rank_textfeild.width = 400;
	        this.rank_textfeild.textColor = 0xffffff;
        	this.rank_textfeild.textAlign = egret.HorizontalAlign.CENTER;
	        this.rank_textfeild.text = "神经全国排名421位";
	        this.rank_textfeild.size = 22;
        	this.rank_textfeild.strokeColor = 0x000000;
        	this.rank_textfeild.stroke = 2;
	        this.rank_textfeild.x = 20;
	        this.rank_textfeild.y = 170;

	        this.beat_textfeild= new egret.TextField();
	        this.beat_textfeild.width = 400;
	        this.beat_textfeild.textColor = 0xff0000;
        	this.beat_textfeild.textAlign = egret.HorizontalAlign.CENTER;
	        this.beat_textfeild.size = 22;
	        this.beat_textfeild.text = "击败了精神病院80%的精神病患者";
	        this.beat_textfeild.x = 20;
	        this.beat_textfeild.y = 200;

	        this.title_textfeild= new egret.TextField();
	        this.title_textfeild.width = 400;
	        this.title_textfeild.textColor = 0xff0000;
        	this.title_textfeild.textAlign = egret.HorizontalAlign.CENTER;
	        this.title_textfeild.size = 24;
	        this.title_textfeild.text = "获得称号：思维广";
	        this.title_textfeild.x = 20;
	        this.title_textfeild.y = 230;


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
	        this.addChild(this.beat_textfeild);
	        this.addChild(this.title_textfeild);
	        this.addChild(this.share_btn);
            this.addChild(this.replay_btn);
            this.addChild(this.mao2_btn);
        }

        public score(n : number){
        	this.tap_textfeild.text = "您用"+n+"步抓住了神经猫";
        	this.rank_textfeild.text = "神经全国排名"+ Math.floor(n*1234678 + Math.random()* n*500) +"位";
        	this.beat_textfeild.text = "击败了精神病院"+(100-Math.floor(n*Math.random()))+"%的精神病患者";
            var title_str: string;
            if(n < 11){
                title_str = this.titles_arr[n];
            }else{
                title_str = this.titles2_arr[Math.floor(Math.random()*this.titles2_arr.length)];
            }
	        this.title_textfeild.text = "获得称号：" +title_str;
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