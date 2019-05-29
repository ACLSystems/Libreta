export class Reports{
  constructor(
    public nombre:string,
    public email:string,
    public avance:number,
    public calificacion:number,
    public estatus:string,
    public grupo:string,
    public curso:string,
    public fechadetermino?:string
  ){

  }
}
