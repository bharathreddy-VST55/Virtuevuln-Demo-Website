import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Base } from './base.entity';
import { User, UserRole } from './user.entity';

@Entity()
export class ChatMessage extends Base {
  @Property({ type: 'text' })
  message: string;

  @ManyToOne(() => User)
  sender: User;

  @Property({ nullable: true, type: 'varchar', length: 50 })
  senderRole: string;

  @Property({ nullable: true, type: 'int' })
  recipientId: number; // For direct messages

  @Property({ type: 'boolean', default: false })
  isPublic: boolean; // Public chat visible to Hashiras

  @Property({ nullable: true, type: 'varchar', length: 255 })
  hashiraImage: string; // Path to Hashira image if sender is Hashira
}

