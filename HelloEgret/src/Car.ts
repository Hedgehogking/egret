module Game {
    export class Car extends egret.DisplayObjectContainer {
        private car:egret.Bitmap;

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        private onAddToStage():void {
            this.car = new egret.Bitmap(RES.getRes('car'))
            this.addChild(this.car)
        }
    }
}