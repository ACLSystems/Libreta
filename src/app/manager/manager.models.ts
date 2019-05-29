export class groupEntity{
  constructor(
    public code:any,
    public name:any,
    public course:any,
    public instructor:any,
    public beginDate:any,
    public endDate:any,
    public orgUnit:any
  ){}
}

export class groupEntityTutor{
  constructor(
    public code:any,
    public name:any,
    public course:any,
    public instructor:any,
    public orgUnit:any
  ){}
}
export class groupModify{
  constructor(
    public groupid:any,
    public status:any
  ){}
}

export class studentmuir{
  constructor(
    public type:any,
    public career?:any,
    public termn?:any
  ){}
}

export class studentexternalmuir{
  constructor(
    public type:any,
    public external:any
  ){}
}

export class corporate{
  constructor(
    public type:any
  ){}
}

export class personmuir{
  constructor(
    public name:any,
    public fatherName:any,
    public motherName:any,
    public email:any
  ){}
}

export class usermuir{
  constructor(
    public person:personmuir,
    public password:any,
    public org:any,
    public orgUnit:any,
    public char1:any,
    public char2:any,
    public student:studentmuir,
    public corporate:corporate
  ){}
}

export class userexternalmuir{
  constructor(
    public person:personmuir,
    public password:any,
    public org:any,
    public orgUnit:any,
    public char1:any,
    public char2:any,
    public student:studentexternalmuir
  ){}
}

export class fiscaladdress{
  constructor(
    public street:string,
    public extNum:string,
    public intNum:string,
    public colony:string,
    public locality:string,
    public municipality:string,
    public zipCode:any
  ){}
}

export class fiscaluser{
  constructor(
    public identification:string,
    public tag:any,
    public name:string,
    public email:string,
    public observations:any,
    public type:any,
    public phonePrimary?:any,
    public phoneSecondary?:any,
    public mobile?:any,
    public address?:fiscaladdress
  ){

  }
}

export class fiscalusercorp{
  constructor(
    public identification:string,
    public tag:any,
    public name:string,
    public email:string,
    public observations:any,
    public type:any,
    public corporate:boolean,
    public orgUnit:any,
    public phonePrimary?:any,
    public phoneSecondary?:any,
    public mobile?:any,
    public address?:fiscaladdress
  ){

  }
}

export class fiscalupdate{
  constructor(
    public tag:string,
    public phonePrimary?:any,
    public phoneSecondary?:any,
    public mobile?:any,
    public address?:fiscaladdress
  ){
  }
}

export class fiscalusernew{
  constructor(
    public name:string,
    public fiscal:fiscaluser
  ){

  }
}

export class fiscalusernewcorp{
  constructor(
    public name:string,
    public fiscal:fiscalusercorp
  ){

  }
}

export class fiscaluserupdates{
  constructor(
    public name:string,
    public fiscal:fiscalupdate
  ){
  }
}

export class fiscalemails{
  constructor(
    public invNumber:any,
    public emails:any[]
  ){}
}

export class fiscalticketdates{
  constructor(
    public invoice:boolean,
  ){}
}

export class fiscalfacdates{
  constructor(
    public invoice:boolean,
    public tag:any
  ){}
}

export class fiscalfacmodel{
  constructor(
    public number:number,
    public fiscal:fiscalfacdates,
    public items:any[]
  ){}
}

export class fiscalticketmodel{
  constructor(
    public number:number,
    public fiscal:fiscalticketdates,
    public items:any[]
  ){}
}

export class roostermodels{
  constructor(
    public code:any,
    public roster:any[]
  ){

  }
}

export class payment{
  constructor(
    public number:number,
    public invoiceNumber:any,
    public idAPIExternal:number,
    public file:any,
    public email:any,
    public notes?:any
  ){}
}
