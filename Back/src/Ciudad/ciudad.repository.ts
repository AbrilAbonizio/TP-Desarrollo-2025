import { Repository } from '../shared/repository.js';
import { Ciudad } from './ciudad.entity.js';

const ciudades = [
  new Ciudad(
    'Arroyo Seco',
    'Santa Fe',
    332,
    251,
    '49417e44-dde4-4e17-92cc-657274948182'
  ),
];

/*
export class CiudadRepository implements Repository<Ciudad> {
  public findAll(): Ciudad[] | undefined {
    return ciudades;
  }
  public findOne(item: { id: string }): Ciudad | undefined {
    return ciudades.find((ciudad) => ciudad.id === item.id);
  }

  public add(item: Ciudad): Ciudad | undefined {
    ciudades.push(item);
    return item;
  }

  public update(item: Ciudad): Ciudad | undefined {
    const ciudadIdx = ciudades.findIndex((ciudad) => ciudad.id === item.id);
    if (ciudadIdx !== -1) {
      ciudades[ciudadIdx] = {
        ...ciudades[ciudadIdx],
        ...item,
      };
      return ciudades[ciudadIdx];
    }
    return undefined;
  }

  public delete(item: { id: string }): Ciudad | undefined {
    const ciudadIdx = ciudades.findIndex((ciudad) => ciudad.id === item.id);
    if (ciudadIdx !== -1) {
      const deletedCiudad = ciudades[ciudadIdx];
      ciudades.splice(ciudadIdx, 1);
      return deletedCiudad;
    }
    return undefined;
  }
}
*/
