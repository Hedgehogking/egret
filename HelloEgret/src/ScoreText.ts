module Game{
    export class ScoreText extends egret.TextField{
        //分数的生产与回收对象池
        private static cacheDict:any[] = [];

        public static produce(score):Game.ScoreText {
            var dict:Game.ScoreText[] = Game.ScoreText.cacheDict;
            var scoreText:Game.ScoreText;
            if (dict.length > 0) {
                scoreText = dict.shift();
                //console.log('from pool')
            } else {
                scoreText = new Game.ScoreText();
            }
            scoreText.text = score;
            //scoreText.fontFamily = '微软雅黑';
            scoreText.bold = true;
            scoreText.size = 30;
            scoreText.textColor = 0xf4dc57;
            scoreText.strokeColor = 0x2e1010;
            scoreText.stroke = 2;
            return scoreText;
        }

        public static reclaim(scoreText:Game.ScoreText) {
            var dict:Game.ScoreText[] = Game.ScoreText.cacheDict;
            if(dict.indexOf(scoreText) == -1){
                dict.push(scoreText);
            }
        }

        public constructor(){
            super();
        }
    }
}