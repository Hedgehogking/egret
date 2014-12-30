module Game {
    export class Santa extends egret.DisplayObjectContainer {
        private stageW:number;
        private stageH:number;

        private santa:egret.MovieClip;
        //圣诞老人移动方向
        public direction:string = 'left';

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        private onAddToStage():void {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var santaPng = RES.getRes('santa_png');
            var santaJson = RES.getRes('santa_json');
            this.santa = new egret.MovieClip(santaJson, santaPng);
            this.santa.frameRate = 3;
            this.addChild(this.santa);
        }

        public init():void {
            this.direction = 'left';
            this.santa.anchorX = 0;
            this.santa.scaleX = 1;
            this.santa.x = 0;
        }

        public start():void {
            this.santa.gotoAndPlay('santa');
        }

        public stop():void {
            this.santa.gotoAndStop('santa');
        }

        public updateSanta(speedOffset:number):void {
            if (this.direction == 'left') {
                if (this.santa.x + (this.stageW - this.santa.width + 185) < 0) {
                    this.direction = 'right';
                    this.santa.anchorX = 1;
                    this.santa.scaleX = -1;
                    this.santa.x += speedOffset * 6;
                } else {
                    this.santa.x -= speedOffset * 6;
                }
            } else {
                if (this.santa.x > 185) {
                    this.direction = 'left';
                    this.santa.anchorX = 0;
                    this.santa.scaleX = 1;
                    this.santa.x -= speedOffset * 6;
                } else {
                    this.santa.x += speedOffset * 6;
                }
            }
        }

        public getSantaX():number {
            return this.santa.x;
        }
    }
}