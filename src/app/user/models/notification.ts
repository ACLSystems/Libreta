import {Objects} from './Objects';

export class Notification{
  constructor(
  public destination: any,
  public message: string,
  public destinationRole: any,
  public objects: Objects[],
  public sourceRole ?:any
  ){}
}
