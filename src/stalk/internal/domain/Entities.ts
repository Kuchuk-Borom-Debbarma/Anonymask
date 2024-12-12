import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'stalk' })
export class StalkEntity {
  @PrimaryColumn({ name: 'stalker', type: 'varchar' })
  stalker: string;
  @PrimaryColumn({ name: 'stalked', type: 'varchar' })
  stalked: string;
  @Column({ name: 'at', type: 'date' })
  at: Date;
}

@Entity({ schema: 'public', name: 'stalk_counter' })
export class StalkCounterEntity {
  @PrimaryColumn({ name: 'user_id', type: 'varchar' })
  userId: string;
  @Column({ name: 'stalker_count', type: 'bigint' })
  stalkerCount: number;
  @Column({ name: 'stalking_count', type: 'bigint' })
  stalkingCount: number;
}
