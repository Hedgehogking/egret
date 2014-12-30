module Game{
    export class Text extends egret.TextField{
        public constructor(text:string){
            super();
            this.text = text;
            this.fontFamily = '微软雅黑';
            this.bold = true;
            this.textAlign = 'center';
        }
    }
}