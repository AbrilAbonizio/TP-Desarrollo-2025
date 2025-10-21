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
    public id?: number
  ) {}
}
