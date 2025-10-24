import {
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Cascade,
  Collection,
  ManyToOne,
  Rel,
  OneToMany,
} from "@mikro-orm/core";
import { Categoria } from "../Categoria/categoria.entity.js";
import { Ciudad } from "../Ciudad/ciudad.entity.js";
import { Solicitud } from "../Solicitud/solicitud.entity.js";
import { Pasajero } from "../Pasajero/pasajero.entity.js";

@Entity()
export class Viaje {
  @PrimaryKey({ nullable: false })
  id!: number;

  @Property({ nullable: false })
  fechaSalida!: Date;

  @Property({ nullable: false })
  fechaLlegada!: Date;

  @Property({ nullable: false })
  estado!: string;

  @Property({ nullable: false })
  cupos!: number;

  @Property({ nullable: false })
  costoEstimado!: number;

  @Property({ nullable: false })
  descVehiculo!: string;

  // CATEGORIAS MUCHJAS A MUCHAS
  @ManyToMany(() => Categoria, (categoria) => categoria.viajes, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  categorias = new Collection<Categoria>(this);

  // MUCHOS VIAJES A UNA CIUDAD, UNA CIUDAD TIENE MUCHOS VIAJES
  @ManyToOne(() => Ciudad, { nullable: false })
  ciudad!: Rel<Ciudad>;

  // UN VIAJE TIENE MUCHAS SOLICITUDES
  @OneToMany(() => Solicitud, (solicitud) => solicitud.viaje, {
    cascade: [Cascade.ALL],
  })
  solicitudes = new Collection<Solicitud>(this);

  // UN VIAJE TIENE UN ORGANIZADOR (PASAJERO)
  @ManyToOne(() => Pasajero, { nullable: false })
  organizador!: Rel<Pasajero>;
}
