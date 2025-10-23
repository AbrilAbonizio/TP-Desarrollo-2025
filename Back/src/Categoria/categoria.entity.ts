import {
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Cascade,
  Collection,
} from "@mikro-orm/core";
import { Viaje } from "../Viaje/viaje.entity.js";

@Entity()
export class Categoria {
  @PrimaryKey({ nullable: false })
  id!: number;

  @Property({ nullable: false })
  descripcion!: string;

  @ManyToMany(() => Viaje, (viaje) => viaje.categorias, {
    cascade: [Cascade.ALL],
  })
  viajes = new Collection<Viaje>(this);
}
