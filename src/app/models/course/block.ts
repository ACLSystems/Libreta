import { Content } from './content';
export class Block{
  constructor(
    public id:string,
    public sectiontitle:string,
    public content:Content[]
  ){}
}
