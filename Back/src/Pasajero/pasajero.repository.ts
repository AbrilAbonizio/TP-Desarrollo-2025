import { Repository } from '../shared/repository.js';
import { Pasajero } from './pasajero.entity.js';

const pasajeros = [
  new Pasajero(
    'Abril',
    'Abonizio',
    '3402549638',
    'San Nicolas 207 bis',
    'abri@gmail',
    [5, 3, 7, 9, 2, 8],
    'd7b8c1a4-3b61-4c9a-bb8b-2b9a1f4de3c6'
  ),
];

export class PasajeroRepository implements Repository<Pasajero> {
  public findAll(): Pasajero[] | undefined {
    return pasajeros;
  }
  public findOne(item: { id: string }): Pasajero | undefined {
    return pasajeros.find((pasajero) => pasajero.id === item.id);
  }

  public add(item: Pasajero): Pasajero | undefined {
    pasajeros.push(item);
    return item;
  }

  public update(item: Pasajero): Pasajero | undefined {
    const pasajeroIdx = pasajeros.findIndex(
      (pasajero) => pasajero.id === item.id
    );
    if (pasajeroIdx !== -1) {
      // Merge directo en la instancia existente
      const existing = pasajeros[pasajeroIdx];
      Object.assign(existing, item);
      return existing;
    }
    return undefined;
  }

  public delete(item: { id: string }): Pasajero | undefined {
    const pasajeroIdx = pasajeros.findIndex((p) => p.id === item.id);
    if (pasajeroIdx !== -1) {
      const deletedPasajero = pasajeros[pasajeroIdx];
      pasajeros.splice(pasajeroIdx, 1);
      return deletedPasajero;
    }
    return undefined;
  }
}
