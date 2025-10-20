import { Repository } from '../shared/repository.js';
import { Pasajero } from './pasajero.entity.js';
import { pool } from '../shared/db/connections.mysql.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class PasajeroRepository implements Repository<Pasajero> {
  // Funcion para encontrar todos los pasajeros
  public async findAll(): Promise<Pasajero[] | undefined> {
    const [pasajeros] = await pool.query('select * from pasajero'); // VER QUE ES UN ROWDATAPACKET que es lo que va a tener adentro pasajero
    return pasajeros as Pasajero[];
  }

  // Funcion para encontrar un pasajero
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

  // Funcion para agregar datos
  public async add(pasajeroInput: Pasajero): Promise<Pasajero | undefined> {
    const { id, ...pasajeroRow } = pasajeroInput;
    const [result] = await pool.query<ResultSetHeader>(
      'insert into pasajero set ?',
      [pasajeroRow]
    );
    pasajeroInput.id = result.insertId;
    return pasajeroInput;
  }

  // Funcion para modificar datos
  public async update(
    id: string,
    pasajeroInput: Pasajero
  ): Promise<Pasajero | undefined> {
    const pasajeroId = Number.parseInt(id);
    if (isNaN(pasajeroId)) {
      // id inválido, no se puede actualizar
      return undefined;
    }
    // No actualizar el id si viene en el body
    const { id: _omit, ...pasajeroRow } = pasajeroInput as Pasajero & {
      id?: number;
    };

    const [result] = await pool.query<ResultSetHeader>(
      'update pasajero set ? where id = ?',
      [pasajeroRow, pasajeroId]
    );

    if (result.affectedRows === 0) {
      return undefined; // no existe ese id
    }

    return { ...pasajeroInput, id: pasajeroId } as Pasajero;
  }

  // Funcion para borrar pasajeros
  public async delete(item: { id: string }): Promise<Pasajero | undefined> {
    throw new Error('not implemented');
  }
}
