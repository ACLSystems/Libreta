/*
"isAdmin":false,
"isBusines":false,
"isOrg":true,
"isOrgContent":false,
"isAuthor":false,
"isSupervisor":false,
"isInstructor":false*/
export class Roles{
  constructor(
    public isAdmin:boolean,
    public isBusines:boolean,
    public isOrg:boolean,
    public isOrgContent:boolean,
    public isAuthor:boolean,
    public isSupervisor:boolean,
    public isInstructor:boolean
    ){
  }
}
