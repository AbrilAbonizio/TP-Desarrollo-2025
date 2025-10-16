export class Viaje {
  constructor(
    public idViaje: number,
    public fechaSalida: Date,
    public fechaLlegada: Date,
    public estado: string,
    public cupos: number,
    public costoEstimado: number,
    public cupoDisponible: number,
    public total: number,
    public totalPorPersona: number,
    public descripcionVehiculo: string
  ) //public categoriaId: number,
  //public ciudadId: number,
  //public organizadorId: number
  {}
}
