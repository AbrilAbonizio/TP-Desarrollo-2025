import { Entity, OneToMany, PrimaryKey, Property , Cascade} from '@mikro-orm/core';
import { Solicitud } from '../Solicitud/solicitud.entity.js';

@Entity()
export class Pasajero {
 
  @PrimaryKey()
  id!: number;

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  apellido!: string;

    //usuario: string,
    //clave: string,

  @Property({nullable:false})
  telefono!: string;

  @Property({nullable:false})
  direccion!: string;

  @Property({ nullable: false })
  email!: string;

  @OneToMany(() => Solicitud, solicitud => solicitud.pasajero, {cascade: [Cascade.ALL]} )
  solicitudes!: Solicitud[]
  
}
