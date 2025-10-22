import { Entity, OneToMany, PrimaryKey, Property , Cascade, Collection, ManyToOne} from '@mikro-orm/core';
import { Pasajero } from '../Pasajero/pasajero.entity.js';
import { Viaje } from '../Viaje/viaje.entity.js';

@Entity()
export class Solicitud {

  @Property({ nullable: false })
  estado!: string;

  @Property()
  fechaSolicitud!: Date;

  // Campos opcionales para enriquecer la respuesta (no necesariamente persistidos)
  @PrimaryKey() @ManyToOne(() => Pasajero, {nullable: false})
  pasajero!: Pasajero;

  @PrimaryKey() @ManyToOne(() => Viaje, {nullable: false})
  viaje!: Viaje;
}


// @OneToMany --> indica que una entidad tiene muchas de otra entidad relacionada.
// @OneToOne --> indica que una entidad tiene una sola entidad relacionada.
// @ManyToOne --> indica que muchas entidades están relacionadas con una sola entidad.  

//() => Pasajero:
//Es una función que devuelve la entidad destino de la relación (en este caso, Solicitud).
//Sirve para evitar problemas de dependencias circulares entre archivos.
//Si invocamos a la propiedad pasajero de la entidad Solicitud,
//obtendremos una instancia de la entidad Pasajero.

//solicitud => solicitud.pasajero:
//Indica qué propiedad de la entidad Solicitud hace referencia al Pasajero.
//Es decir, que dentro de Solicitud hay una propiedad: @ManyToOne