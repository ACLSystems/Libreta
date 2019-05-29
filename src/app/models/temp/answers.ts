export class Answers{
  constructor(
    //public idquestion:any,
    public answer:any,
    public type:any,
    public index:any,
    public indexquestions:number
  ){

  }
}

export class AnswersV1{
  constructor(
    public idquestion:any,
    public result:Answers[]
  ){

  }
}
