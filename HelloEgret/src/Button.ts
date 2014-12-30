module Game{
    export class Button extends egret.DisplayObjectContainer{
        public constructor(text:string){
            super();
            var btnBg:egret.Bitmap;
            var btnText:Game.Text;
            btnBg = new egret.Bitmap(RES.getRes("btn_bg"));//开始按钮
            this.width = btnBg.width;
            this.height = btnBg.height;
            this.touchEnabled = true;//开启触碰
            //开始按钮文字
            btnText = new Game.Text(text);
            btnText.width = this.width;
            btnText.y = 34;
            this.addChild(btnBg);
            this.addChild(btnText);
        }
    }
}