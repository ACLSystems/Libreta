export class Doubt{
  constructor(
    public course:any,
    public group:any,
    public type:string,
    public title:string,
    public text:string,
    public pubtype:string,
    public block?:any,
    public sendTo?:any
  ){
  }
}
