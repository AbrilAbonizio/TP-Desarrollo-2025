/*import { Repository } from '../shared/repository.js';
import { Ciudad } from './ciudad.entity.js';
import { pool } from '../shared/db/connections.mysql.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class CiudadRepository implements Repository<Ciudad> {
 
  public async findAll(): Promise<Ciudad[] | undefined> {
    const [ciudades] = await pool.query('select * from ciudad'); 
    return ciudades as Ciudad[];
  }


  public async findOne(item: { id: string }): Promise <Ciudad | undefined>{
    const id = Number.parseInt(item.id);

    // Validar que el id sea un número válido
    if (isNaN(id)) {
      return undefined;
    }

    const [ciudades] = await pool.query<RowDataPacket[]>(
      'select * from ciudad where id = ?',
      [id]
    );
    if (ciudades.length === 0) {
      return undefined;
    }
    const ciudad = ciudades[0] as Ciudad;
    return ciudad;
  }
  

  public async add(ciudadInput: Ciudad): Promise<Ciudad | undefined> {
    const { id, ...ciudadRow } = ciudadInput;
      const [result] = await pool.query<ResultSetHeader>('insert into ciudad set ?',[ciudadRow]);
      ciudadInput.id = result.insertId;
      return ciudadInput;
    }


  public async update(id: string, ciudadInput: Ciudad): Promise<Ciudad | undefined> {
    const ciudadId = Number.parseInt(id);
    if (isNaN(ciudadId)) {
      // id inválido, no se puede actualizar
      return undefined;
    }
    // No actualizar el id si viene en el body
    const { id: _omit, ...ciudadRow } = ciudadInput as Ciudad & {id?: number;};
    
    const [result] = await pool.query<ResultSetHeader>('update ciudad set ? where id = ?', [ciudadRow, ciudadId]);
    
    if (result.affectedRows === 0) {
      return undefined; // no existe ese id
    }
    
    return await this.findOne({ id });
  }

  public async delete(item: { id: string }): Promise<Ciudad | undefined> {
    try {
      const ciudadToDelete = await this.findOne(item);
      const ciudadId = Number.parseInt(item.id);
      await pool.query('delete from viaje where idCiudad = ? ', [ciudadId]);
      await pool.query('delete from ciudad where id = ?', [ciudadId]);
      return ciudadToDelete;
    } catch (error: any) {
      throw new Error('unable to delete ciudad');
    }
  }

}

*/