import crypto from 'node:crypto';

export class Solicitud {
  constructor(
    public estado: string,
    public fechaSolicitud: Date,
    public idPasajero: string,
    public idViaje: string
  ) {}
}
