import crypto from 'node:crypto';

export class Ciudad {
  constructor(
    public nombre: string,
    public provincia: string,
    public latitud: number,
    public longitud: number,
    public id = crypto.randomUUID()
  ) {}
}
