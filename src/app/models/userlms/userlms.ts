import { Person } from './../person/person';
//import { Student } from './../student/student';
export class Userlms{
  constructor(
    public name:string,
    public password:string,
    public person:Person,
    public student:any,
    public org:string,
    public orgUnit:string
  ){
  }
}

export class UserValidate{
  constructor(
    public name:string,
    public person:Person
  ){

  }
}
