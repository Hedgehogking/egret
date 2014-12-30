/**
 * Created by zen on 14-7-13.
 */
module catgame
{
  /**
   * 地图
   */
  export class Map extends egret.DisplayObjectContainer
  {
    private map : any[] = [];
    private mapsize: number = 9; //必须奇数
    private playTurn : boolean = true;
    private block : number = 0.2;
    public tap : number = 0;
  	public constructor() {
          super();
          this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    
    private onAddToStage(event:egret.Event){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    /**初始化*/
    public init(){
      while(this.numChildren){
        this.removeChildAt(0);
      }
      this.map = [];
      this.createMap();
      this.tap = 0;
    }

    /**创建地图**/
   	private createMap(){
      var node : catgame.Node;
      //var txt:egret.TextField;
   		for(var i :number = 0 ; i < this.mapsize ; i++){
        this.map[i] = [];
        for(var j :number = 0 ; j < this.mapsize; j++){
   			  node = new catgame.Node(i , j);
   			  node.x = i * 48 + (j%2) * 24;
   			  node.y = j * 44;
          this.map[i][j] = node;
          node.touchEnabled = true;//开启触碰
          node.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onNodeClick,this);
   			  this.addChild(node);

          var cc : number = (this.mapsize -1)/2;
          if(i != cc && j != cc && Math.random() < this.block){
            node.doFillPot();
            node.touchEnabled = false;
          }

          /*
          txt = new egret.TextField();
          txt.x = node.x - 25;
          txt.y = node.y - 15;
          txt.width = 50;
          txt.height = 20;
          txt.size = 14;
          txt.textColor = 0x000000;
          txt.textAlign = "center";
          txt.strokeColor = 0xFFFFFF;
          txt.stroke = 1;
          txt.text = i + " , " + j;
          this.addChild(txt);
          */
        }
   		}
   	}

    public lock():void{
      this.playTurn = false;
    }

    public unlock():void{
      this.playTurn = true;
    }

    public getNode(arr:number[]){
      return this.map[arr[0]][arr[1]];
    }

    /**node被点击**/
    private onNodeClick(evt:egret.TouchEvent):void{
      if(!this.playTurn){
        //console.log("猫咪回合");
        return;
      }
      this.tap = this.tap + 1;
      var node:catgame.Node = evt.target;
      node.doFillPot();
      node.touchEnabled = false;
      node.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onNodeClick,this);
      //this.showRound(node);
      this.dispatchEventWith("nodeClick");
    }

    /**显示周围6个格子**/
    private showRound(node:catgame.Node):void{
      //console.log(node.getPos());
      var pos:number[] = node.getPos();
      var arr:any[] = this.getRound(pos);
      var l:number = arr.length;
      var n:catgame.Node;
      //清理其他的格子
      for(var i :number = 0 ; i < this.mapsize ; i++){
        for(var j :number = 0 ; j < this.mapsize; j++){
          if(i == pos[0] && j== pos[1]){
            //console.log("原来的格子");
          }else{
            n = this.map[i][j];
            n.clean();
          }
        }
      }
      //显示周围的6个格子
      for(i = 0 ; i < l ;i++){
        var rnd:number[] = arr[i];
        n =  this.map[rnd[0]][rnd[1]];
        n.doFillPot();
      }
    }

    /**二维坐标到点**/
    public coverPos2Point(__arr:number[]){
        return [this.x + 48 * __arr[0] + (__arr[1]%2) * 24 , this.y + __arr[1] * 44];
    }

    /**计算周围格子**/
    private getRound(__point:number[]){
      var xx : number = __point[0];
      var yy : number = __point[1];
      var arr:any[];
      var ret:any[] = [];
      if(yy % 2 == 0){
        arr =  [[xx-1,yy-1],[xx-1,yy],[xx-1,yy+1],[xx,yy+1],[xx+1,yy],[xx,yy-1]];
      }else{
        arr =  [[xx,yy-1],[xx-1,yy],[xx,yy+1],[xx+1,yy+1],[xx+1,yy],[xx+1,yy-1]];
      }
      for(var i : number = 0 ; i < 6 ; i++){
        var rnd:number[] = arr[i];
        if(rnd[0] >= 0 && rnd[1] >=0 && rnd[0]<this.mapsize && rnd[1]<this.mapsize){
          ret.push(rnd);
        }
      }
      return ret;
    }

    /**计算寻路,泛洪计算,可优化**/
    public findPath(__from : catgame.Node){
      //清理其他的格子
      var node : catgame.Node
      for(var i :number = 0 ; i < this.mapsize ; i++){
        for(var j :number = 0 ; j < this.mapsize; j++){
            node = this.map[i][j];
            node.clean();
        }
      }

      node = this.findNode(__from);

      var path : any[] = [];
      if(node){
        //
        while(node.prenode){
          path.push(node.getPos());
          node  = node.prenode;
        }

      }else{
        //
        console.log("已经被困随便走一步");
        this.dispatchEventWith("weizhu");
        //随便走一步
        path = this.getNear(__from);

      }
      return path.reverse();
    }


    private randomSort(a , b){
      if(Math.random() > 0.5)
        return 1;
      return -1;
    }

    private findNode(__from : catgame.Node){
      var used:catgame.Node[] = [__from]; //已经覆盖的点
      var next:catgame.Node[] = [__from];  //下一轮可以走的点
      var flag:boolean = true;
      var around : any[];
      //around = this.getRound(__from.getPos());
      var i : number = 0 ;
      var l : number = 0;
      var j : number = 0;
      var k : number = 0;
      var node : catgame.Node;//当前中心点
      var tnode : catgame.Node;//当前周围点
      while(flag){
        l = next.length;
        //console.log("寻路中..." + l);
        if(l ==0 ){
          flag = false;
          return null;//无解
        }
        var tnext:catgame.Node[] = [];
        for(i = 0 ;i < l;i++){
          node = next.shift();
          around = this.getRound(node.getPos());
          k = around.length;
          //console.log("下一层路点..." + k)
          for( j = 0 ; j < k ; j++){
            var rnd:number[] = around[j];
            tnode = this.map[rnd[0]][rnd[1]];
            if(tnode.isFill()){ //不可走
              used.push(tnode);
              continue;
            }
            if(used.indexOf(tnode) > -1 || next.indexOf(tnode) > -1){//已经计算过了,或者已经在下一轮计算备选中了
              continue;
            }
            tnode.prenode = node;
            if(this.isExit(tnode)){
              //console.log("找到出口，最短路径")
              return tnode;//最短路径
            }
            tnext.push(tnode);
          }
          used.push(node);
        }
        next = tnext;
      }
    }

    /**获得可走的点**/
    public getNear(__node: catgame.Node){
      var pos:number[] = __node.getPos();
      var arr:any[] = this.getRound(pos);
      var l:number = arr.length;
      for(var i :number = 0 ; i < l ; i++){
        if(!this.getNode(arr[i]).isFill()){
          return [arr[i]];
        }
      }
      return [];
    }

    /**是否是出口**/
    public isExit(__node: catgame.Node){
      var sd : number[] = __node.getPos();
      if(sd[0] == 0 || sd[1] == 0 || sd[0] == this.mapsize-1 || sd[1] == this.mapsize-1){
        return true;
      }
      return false;
    }
  }
}