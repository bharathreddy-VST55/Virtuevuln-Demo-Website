// item.entity.ts
import { BlobType, Entity, Property, Enum } from '@mikro-orm/core';
import { Base } from './base.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  HASHIRA = 'hashira',
  DEMON_SLAYER_CORPS = 'demon_slayer_corps',
  PEOPLE = 'people'
}

@Entity()
export class User extends Base {
  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property()
  isAdmin: boolean;

  @Property({
    type: 'varchar',
    length: 50,
    default: UserRole.PEOPLE
  })
  role: string = UserRole.PEOPLE;

  @Property({
    nullable: true,
    type: BlobType
  })
  photo: Buffer;

  @Property()
  company: string;

  @Property()
  cardNumber: string;

  @Property()
  phoneNumber: string;

  @Property()
  isBasic: boolean;
}
