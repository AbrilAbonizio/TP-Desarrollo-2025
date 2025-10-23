import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Cascade,
  Collection,
} from "@mikro-orm/core";
import { Viaje } from "../Viaje/viaje.entity.js";

@Entity()
export class Ciudad {
  @PrimaryKey({ nullable: false })
  id!: number;

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  provincia!: string;

  @Property({ nullable: false })
  latitud!: number;

  @Property({ nullable: false })
  longitud!: number;

  @OneToMany(() => Viaje, (viaje) => viaje.ciudad, { cascade: [Cascade.ALL] })
  viajes = new Collection<Viaje>(this);
}
