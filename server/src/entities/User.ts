import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field((_returns) => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;

  @Field()
  @Property()
  createdAt?: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
