import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { User } from './user.entity';

export enum MissionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MissionType {
  KILL_DEMON = 'kill_demon',
  GATHER_INTEL = 'gather_intel',
  PROTECT_LOCATION = 'protect_location',
  INVESTIGATE = 'investigate'
}

@Entity()
export class Mission extends Base {
  @Property()
  title: string;

  @Property({ type: 'text' })
  description: string;

  @Property({
    type: 'varchar',
    length: 50,
    default: MissionType.KILL_DEMON
  })
  missionType: string;

  @Property({
    type: 'varchar',
    length: 50,
    default: MissionStatus.PENDING
  })
  status: string;

  @ManyToOne(() => User)
  assignedBy: User; // Hashira who assigned the mission

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User | null; // Demon Slayer Corps member

  @Property({ nullable: true, type: 'varchar', length: 255 })
  location: string;

  @Property({ nullable: true, type: 'text' })
  notes: string;

  @Property({ nullable: true, type: 'timestamptz' })
  completedAt: Date;
}

