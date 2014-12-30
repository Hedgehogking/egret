/**
 * Created by zen on 14-7-13.
 */
module catgame
{
    /**
     * 猫
     */
    export class Cat extends egret.Sprite
    {
        public node : catgame.Node;
        private isWeizhu : boolean = false;
        private standmc : egret.MovieClip;
        private weizhumc : egret.MovieClip;


    	public constructor() {
            super();
            var data = RES.getRes("stay_json");
            var texture = RES.getRes("stay_png");
            this.standmc = new egret.MovieClip(data, texture);
            this.standmc.setInterval(3);
            this.standmc.gotoAndPlay("stay");

            data = RES.getRes("weizhu_json");
            texture = RES.getRes("weizhu_png");
            this.weizhumc = new egret.MovieClip(data, texture);
            this.weizhumc.setInterval(3);
            this.weizhumc.gotoAndPlay("weizhu");

            this.anchorX = 0.5;
            this.anchorY = 1;
            this.stay();
        }

        public init():void{
            this.isWeizhu = false;
            this.stay();
        }

        /**走一步 , 行走动画啥的**/
        public run(pos:number[]):void{
            this.x = pos[0];
            this.y = pos[1];
            this.dispatchEventWith("catRun");
        }

        /**站定**/
        public stay():void{
            if(this.numChildren){
                this.removeChildAt(0);
            }
            if(this.isWeizhu){
                this.addChild(this.weizhumc);
            }else{
                this.addChild(this.standmc);
            }
        }

        public weizhu(){
            this.isWeizhu = true;
            this.stay();
        }

        /**成功动画**/
        public successShow():void{

        }
        /**失败动画**/
        public failShow():void{

        }
    }
}