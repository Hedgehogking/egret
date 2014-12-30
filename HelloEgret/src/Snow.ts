module Game{
    export class Snow extends egret.Shape{
        //飘雪的生产与回收对象池
        private static cacheDict:any[] = [];

        public static produce():Game.Snow {
            var dict:Game.Snow[] = Game.Snow.cacheDict;
            var snow:Game.Snow;
            if (dict.length > 0) {
                snow = dict.shift();
                //console.log('from pool')
            } else {
                snow = new Game.Snow();
            }
            return snow;
        }

        public static reclaim(snow:Game.Snow) {
            var dict:Game.Snow[] = Game.Snow.cacheDict;
            if(dict.indexOf(snow) == -1){
                dict.push(snow);
            }
        }

        private static randomR():number{
            return Math.random() * 4 + 1;
        }

        public constructor(){
            super();
            this.graphics.beginFill(0xffffff,Math.random() * 0.7 + 0.3);
            this.graphics.drawCircle(0,0,Game.Snow.randomR());
            this.graphics.endFill();
        }
    }
}