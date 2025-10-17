import crypto from 'node:crypto';

export class Pasajero {
  constructor(
    public nombre: string,
    public apellido: string,
    //public usuario: string,
    //public clave: string,
    public telefono: string,
    public direccion: string,
    public email: string,
    public calificaciones: number[] = [], // contiene solo numeros, en un futuro va a contener entidades de una clase
    public id = crypto.randomUUID()
  ) {}

  get calificacionPromedio(): number {
    if (this.calificaciones.length === 0) return 0;
    const suma = this.calificaciones.reduce((acc, valor) => acc + valor, 0);
    return suma / this.calificaciones.length;
  }
}
