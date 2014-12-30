module Game {
    export class Gift extends egret.Bitmap {
        private gift:egret.Bitmap;
        private giftType:string;
        public giftTypeIdx:number;
        public score:number;
        public bounds:egret.Rectangle;

        //游戏机制
        private static giftTypeArr:any[] = ['gift1', 'gift2', 'gift3', 'gift4', 'gift5'];//礼物种类
        private static minScore:number = 10;//礼物最低分数
        private static maxScore:number = 50;//礼物最高分数

        //礼物的生产与回收对象池
        private static cacheDict:Object = {};

        public static produce():Game.Gift {
            var giftTypeIdx:number = Math.floor(Math.random() * Game.Gift.giftTypeArr.length)
            var giftType:string = Game.Gift.giftTypeArr[giftTypeIdx];
            if (Game.Gift.cacheDict[giftType] == null) {
                Game.Gift.cacheDict[giftType] = [];
            }
            var dict:Game.Gift[] = Game.Gift.cacheDict[giftType];
            var gift:Game.Gift;
            if (dict.length > 0) {
                gift = dict.shift();
                //console.log('from pool')
            } else {
                gift = new Game.Gift(RES.getRes(giftType));
            }
            gift.giftType = giftType;
            gift.giftTypeIdx = giftTypeIdx;
            gift.score = Game.Gift.getGiftRandomScore();
            gift.bounds = gift.getBounds();
            return gift;
        }

        public static reclaim(gift:Game.Gift) {
            var giftType = gift.giftType;
            if (Game.Gift.cacheDict[giftType] == null) {
                Game.Gift.cacheDict[giftType] = [];
            }
            var dict:Game.Gift[] = Game.Gift.cacheDict[giftType];
            if(dict.indexOf(gift) == -1){
                Game.Gift.cacheDict[giftType].push(gift);
            }
        }

        public constructor(texture:egret.Texture) {
            super(texture);
        }

        private static getGiftRandomScore():number {
            return Math.floor(this.minScore + Math.random() * (this.maxScore - this.minScore));
        }

    }
}