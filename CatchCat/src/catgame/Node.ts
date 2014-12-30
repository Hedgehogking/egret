/**
 * Created by zen on 14-7-13.
 */
module catgame
{
    /**
     * 地图
     */
    export class Node extends egret.Bitmap
    {
        private posx : number;
        private posy : number;
        private fill : boolean;
        public prenode : Node; //寻路使用，路径前步
        public constructor(__posx:number , __posy:number) {
            var texture :egret.Texture = RES.getRes("pot1");
            this.posx = __posx;
            this.posy = __posy;
            super(texture);
            this.anchorX = this.anchorY = 0.5;
            this.fill = false;
        }

        public doFillPot(){
            this.texture = RES.getRes("pot2");
            this.fill = true;
        }

        public clean(){
            this.prenode = null;
        }

        public getPos(){
            return [this.posx,this.posy];
        }

        public isFill(){
            return this.fill;
        }
    }
}