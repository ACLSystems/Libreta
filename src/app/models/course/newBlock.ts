import { Questionnarie } from './../temp/questionnarie';

export class NewBlock{
  constructor(
    public coursecode:string,
    public code:string,
    public title:string,
    public type:string,
    public w:number,
    public wq:number,
    public wt:number,
    public content?:string,
    public questionnarie?:Questionnarie
  ){

  }
}

export class Coursecode{
  constructor(
    public coursecode:string
  ){}
}

export class ContentCourse{
  constructor(
    public content:string
  ){}
}

export class Questionn{
  constructor(
    public questionnarie:Questionnarie
  ){

  }
}
