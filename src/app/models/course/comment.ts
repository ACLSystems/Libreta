export class Comment{
  constructor(
    public course:any,
    public group:any,
    public type:string,
    public root:any,
    public replyto:any,
    public text:string,
    public block?:any
  ){
  }
}
