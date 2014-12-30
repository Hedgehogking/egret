module Game{
    export class SharePanel extends egret.Sprite{
        private stageH:number;
        private stageW:number;
        public constructor(){
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }

        private onAddToStage():void{
            this.stageH = this.stage.stageHeight;
            this.stageW = this.stage.stageWidth;


            //黑色半透明背景
            var panelBg:egret.Shape = new egret.Shape();
            panelBg.graphics.beginFill(0x000000,.3);
            panelBg.graphics.drawRect(0,0,this.stageW,this.stageH);
            panelBg.graphics.endFill();
            this.addChild(panelBg);

            //背景图片
            var shareBg:egret.Bitmap = new egret.Bitmap(RES.getRes('img_toshare_430x510'));
            this.addChild(shareBg);
            shareBg.x = (this.stageW - shareBg.width) / 2;
            shareBg.y = 100;

            //分享标题
            var shareTitle:Game.Text = new Game.Text(window["lanLib"]["sharepanel_title"]);/**传参*/
            shareTitle.textColor = 0x000000;
            shareTitle.strokeColor = 0xffffff;
            shareTitle.stroke = 2;
            shareTitle.size = 40;
            shareTitle.width = 380;
            shareTitle.x = (this.stageW - shareTitle.width) / 2;
            shareTitle.y = 360;
            this.addChild(shareTitle);

            //分享文字
            var shareText:Game.Text = new Game.Text(window["lanLib"]["sharepanel_text"]);/**传参*/
            shareText.textColor = 0xF7E656;
            shareText.bold = false;
            shareText.width = 400;
            shareText.x = (this.stageW - shareText.width) / 2;
            shareText.y = 450;
            this.addChild(shareText);



        }
    }
}