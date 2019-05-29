export class Block{
  constructor(
    public content?:any,
    public code?:string,
    public title?:any,
    public status?:any,
    public isVisible?:any,
    public media?:any,
    public w?:number,
    public wt?:number,
    public wq?:number
  ){

  }
}

export class BlockCode{
  constructor(
    public code:any
  ){

  }
}

export class BlockVisible{
  constructor(
    public isVisible:any
  ){

  }
}

export class BlockStatus{
  constructor(
    public status:any
  ){}
}

export class BlockTitle{
  constructor(
    public title:any
  ){

  }
}
export class BlockMedia{
  constructor(
    public media:any
  ){

  }
}

export class BlockWb{
  constructor(
    public w:number
  ){

  }
}

export class BlockWt{
  constructor(
    public wt:number
  ){

  }
}

export class BlockWq{
  constructor(
    public wq:number
  ){

  }
}
