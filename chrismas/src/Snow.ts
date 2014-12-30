/**
 * Created by Administrator on 2014/12/23.
 */
class Snow extends egret.DisplayObjectContainer{
    private stageW:number;
    private stageH:number;

    private allCicle:any[] = [];
    private cicleTimer:egret.Timer;
    private cicleInterval:number = 100;
    private preCreateNum:number = 60;
    private cicleGoDownTime:number = 10000;

    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage():void{
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;

        var i:number = 0;
        for(i = 0; i < this.preCreateNum; i++){
            this.creatCicle();
        }
        var cicleTimer:egret.Timer = new egret.Timer(this.cicleInterval);
        cicleTimer.addEventListener(egret.TimerEvent.TIMER,this.creatCicle,this);
        cicleTimer.start();
    }

    private creatCicle():void{
        var cicle:Cicle = Cicle.produce();
        cicle.x = Math.random() * this.stageW;
        if(this.allCicle.length >= this.preCreateNum){
            cicle.y = -20;
        }else{
            cicle.y = Math.random() * this.stageH;
        }
        this.allCicle.push(cicle);
        this.addChild(cicle);
        var gotoX:number = cicle.x + (Math.random() - 0.5) * this.stageW;
        var gotoY:number = this.stageH + 20;
        var time:number = this.cicleGoDownTime - cicle.y / ((this.stageH + 40) / this.cicleGoDownTime);
        egret.Tween.get(cicle).to({x:gotoX,y:gotoY},time).call(this.cicleAnimationEnd,this,[cicle]);
    }

    private cicleAnimationEnd(cicle):void{
        this.allCicle.splice(this.allCicle.indexOf(cicle),1);
        egret.Tween.removeTweens(cicle);
        Cicle.reclaim(cicle);
        this.removeChild(cicle);
    }
}

class Cicle extends egret.Shape{
    private static cacheDict:any[] = [];

    public static produce():Cicle{
        var cicle:Cicle;
        if(Cicle.cacheDict.length > 0){
            cicle = Cicle.cacheDict.shift();
        }else{
            cicle = new Cicle();
        }
        return cicle;
    }

    public static reclaim(cicle:Cicle):void{
        if(Cicle.cacheDict.indexOf(cicle) == -1){
            Cicle.cacheDict.push(cicle);
        }
    }

    public constructor(){
        super();
        this.graphics.beginFill(0xffffff,Math.random() * 0.7 + 0.3);
        this.graphics.drawCircle(0,0,Math.random() * 4 + 1);
        this.graphics.endFill();
    }
}