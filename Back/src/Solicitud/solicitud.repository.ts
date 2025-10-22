/*import { Repository } from '../shared/repository.js';
import { Solicitud } from './solicitud.entity.js';
import { pool } from '../shared/db/connections.mysql.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Viaje } from '../Viaje/viaje.entity.js';
import { Pasajero } from '../Pasajero/pasajero.entity.js';


export class SolicitudRepository implements Repository<Solicitud> {
  public async findAll(): Promise<Solicitud[] | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         s.estado              AS s_estado,
         s.fechaSolicitud      AS s_fechaSolicitud,
         s.idPasajero          AS s_idPasajero,
         v.id                  AS v_id,
         v.idCiudad            AS v_idCiudad,
         v.idOrganizador       AS v_idOrganizador,
         v.fechaSalida         AS v_fechaSalida,
         v.fechaLlegada        AS v_fechaLlegada,
         v.estado              AS v_estado,
         v.cupos               AS v_cupos,
         v.costoEstimado       AS v_costoEstimado,
         v.descVehiculo        AS v_descVehiculo,
         p.id                  AS p_id,
         p.nombre              AS p_nombre,
         p.apellido            AS p_apellido,
         p.telefono            AS p_telefono,
         p.direccion           AS p_direccion,
         p.email               AS p_email
       FROM solicitud s
       INNER JOIN viaje v ON s.idViaje = v.id
       INNER JOIN pasajero p ON s.idPasajero = p.id`
    );

    const solicitudes = (rows as any[]).map((row) => {
      const pasajero = new Pasajero(
        row.p_nombre,
        row.p_apellido,
        row.p_telefono,
        row.p_direccion,
        row.p_email,
        row.p_id
      );
      const viaje = new Viaje(
        row.v_id,
        row.v_idCiudad,
        row.v_idOrganizador,
        row.v_fechaSalida,
        row.v_fechaLlegada,
        row.v_estado,
        row.v_cupos,
        row.v_costoEstimado,
        row.v_descVehiculo
      );
      return new Solicitud(
        row.s_estado,
        row.s_fechaSolicitud,
        pasajero,
        viaje,
        row.p_nombre,
        row.p_apellido
      );
    }) as Solicitud[];

    return solicitudes;
  }


  


  public async findOne(item: { id: string }): Promise <Solicitud | undefined> {
    throw new Error ('not implemented')
  }

  public async add(item: Solicitud): Promise <Solicitud | undefined> {
    throw new Error ('not implemented')
  }

  public async update(id: string, solicitudInput: Solicitud):Promise <Solicitud | undefined> {
    throw new Error ('not implemented')
  }

  public async delete(item: { id: string }): Promise <Solicitud | undefined>{
    throw new Error ('not implemented')
  }
}

*/