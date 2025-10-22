/*import { Repository } from '../shared/repository.js';
import { Viaje } from './viaje.entity.js';


const viajes = [
  new Viaje(
    1,
    new Date("2023-12-01"),
    new Date("2023-12-10"),
    "Arrivando",
    4,
    1299.99,
    1,
    5999.99,
    5999.99 / 5,
    "Lamborghini"
  ),
];

export class ViajeRepository implements Repository<Viaje> {
  public findAll(): Viaje[] | undefined {
    return viajes;
  }

  public findOne(item: { id: string }): Viaje | undefined {
    return viajes.find((viaje) => viaje.idViaje === parseInt(item.id));
  }

  public add(item: Viaje): Viaje | undefined {
    // Generar el nuevo ID basado en el último viaje + 1
    const newId =
      viajes.length > 0 ? Math.max(...viajes.map((v) => v.idViaje)) + 1 : 1;

    // Crear nuevo viaje con el ID generado
    const newViaje = new Viaje(
      newId,
      item.fechaSalida,
      item.fechaLlegada,
      item.estado,
      item.cupos,
      item.costoEstimado,
      item.cupoDisponible,
      item.total,
      item.totalPorPersona,
      item.descripcionVehiculo
    );

    viajes.push(newViaje);
    return newViaje;
  }

  public update(item: Viaje): Viaje | undefined {
    const viajeIdx = viajes.findIndex(
      (viaje) => viaje.idViaje === item.idViaje
    );
    if (viajeIdx !== -1) {
      viajes[viajeIdx] = {
        ...viajes[viajeIdx],
        ...item,
      };
      return viajes[viajeIdx];
    }
    return undefined;
  }

  public delete(item: { id: string }): Viaje | undefined {
    const viajeIdx = viajes.findIndex(
      (viaje) => viaje.idViaje === parseInt(item.id)
    );

    if (viajeIdx !== -1) {
      const deletedViaje = viajes[viajeIdx];
      viajes.splice(viajeIdx, 1);
      return deletedViaje;
    }
    return undefined;
  }
}
*/
