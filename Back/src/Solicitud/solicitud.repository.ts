import { Repository } from '../shared/repository.js';
import { Solicitud } from './solicitud.entity.js';

/*
const solicitudes = [
  new Solicitud(
    'Pendiente',
    new Date('2025-10-16'),
    '3b241101-e2bb-4255-8caf-4136c566a962'
  ),
];

export class SolicitudRepository implements Repository<Solicitud> {
  public findAll(): Solicitud[] | undefined {
    return solicitudes;
  }
  public findOne(item: { id: string }): Solicitud | undefined {
    return solicitudes.find((solicitud) => solicitud.id === item.id);
  }

  public add(item: Solicitud): Solicitud | undefined {
    solicitudes.push(item);
    return item;
  }

  public update(item: Solicitud): Solicitud | undefined {
    const solicitudesIdx = solicitudes.findIndex(
      (solicitud) => solicitud.id === item.id
    );
    if (solicitudesIdx !== -1) {
      solicitudes[solicitudesIdx] = {
        ...solicitudes[solicitudesIdx],
        ...item,
      };
      return solicitudes[solicitudesIdx];
    }
    return undefined;
  }

  public delete(item: { id: string }): Solicitud | undefined {
    const solicitudIdx = solicitudes.findIndex((p) => p.id === item.id);
    if (solicitudIdx !== -1) {
      const deletedSolicitud = solicitudes[solicitudIdx];
      solicitudes.splice(solicitudIdx, 1);
      return deletedSolicitud;
    }
    return undefined;
  }
}
*/
