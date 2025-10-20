export class Viaje {
  constructor(
    public id: number,
    public idCiudad: number,
    public idOrganizador: number,
    public fechaSalida: Date,
    public fechaLlegada: Date,
    public estado: string,
    public cupos: number,
    public costoEstimado: number,
    //public cupoDisponible: number, como es calculado no se guarda dentro de la entidad
    //public total: number, se calcula mas adelante con los gastos asociados
    //public totalPorPersona: number,
    public descVehiculo: string
  ) {}
}
