export class Course{
  constructor(
    public id:string,
    public title:string,
    public code:string,
    public description:string ,
    public categories: any[],
    public isVisible: boolean,
    public version:number,
    public status:string,
    public price:number,
    public author:string
  ){}
}
