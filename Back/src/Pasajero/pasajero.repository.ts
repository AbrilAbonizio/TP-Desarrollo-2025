import { Repository } from '../shared/repository.js';
import { Pasajero } from './pasajero.entity.js';
import { pool } from '../shared/db/connections.mysql.js';
import { RowDataPacket } from 'mysql2';

/*const pasajeros = [
  new Pasajero(
    'Abril',
    'Abonizio',
    '3402549638',
    'San Nicolas 207 bis',
    'abri@gmail',
    'd7b8c1a4-3b61-4c9a-bb8b-2b9a1f4de3c6'
  ),
];
*/

export class PasajeroRepository implements Repository<Pasajero> {
  public async findAll(): Promise<Pasajero[] | undefined> {
    const [pasajeros] = await pool.query('select * from pasajero'); // VER QUE ES UN ROWDATAPACKET que es lo que va a tener adentro pasajero
    return pasajeros as Pasajero[];
  }

  public async findOne(item: { id: string }): Promise<Pasajero | undefined> {
    const id = Number.parseInt(item.id);

    // Validar que el id sea un número válido
    if (isNaN(id)) {
      return undefined;
    }

    const [pasajeros] = await pool.query<RowDataPacket[]>(
      'select * from pasajero where id = ?',
      [id]
    );
    if (pasajeros.length === 0) {
      return undefined;
    }
    const pasajero = pasajeros[0] as Pasajero;
    return pasajero;
  }

  public async add(item: Pasajero): Promise<Pasajero | undefined> {
    throw new Error('not implemented');
  }

  public async update(
    id: string,
    item: Pasajero
  ): Promise<Pasajero | undefined> {
    throw new Error('not implemented');
  }

  public async delete(item: { id: string }): Promise<Pasajero | undefined> {
    throw new Error('not implemented');
  }
}
