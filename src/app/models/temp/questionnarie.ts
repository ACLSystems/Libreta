export class Questionnarie{
  constructor(
    public begin:boolean,
    public maxAttemps:number,
    public minimum:number,
    public questions:Question[]=[]
  ){

  }
}

export class Question{
  constructor(
    public answers:Answer[]=[],
    public options:Option[]=[],
    public text:string,
    public type:string,
    public w:number,
    public help:string,
    public display:string[]=[],
    public header?:string,
    public footer?:string
  ){

  }
}

export class Answer{
  constructor(
    public type:string,
    public index:number
  ){

  }
}

export class Option{
  constructor(
    public name:string,
    public value:string
  ){

  }
}
