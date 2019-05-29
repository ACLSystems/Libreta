import { Task } from './../temp/task';
//import { Student } from './../student/student';
export class TaskEntry{
  constructor(
    public groupid:any,
    public blockid:any,
    public task:Task[],
    public force?:boolean
  ){
  }
}
