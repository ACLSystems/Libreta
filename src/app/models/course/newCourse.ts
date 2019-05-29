export class NewCourse{
  constructor(
    public code:string,
    public title:string,
    public type:string,
    public categories:string[],
    public isVisible:boolean,
    public keywords:string[],
    public description:string,
    public details:string,
    public price:any,
    public cost:any,
    public status:string,
    public duration:number,
    public durationUnits:string,
    public image:any
  ){

  }
}
