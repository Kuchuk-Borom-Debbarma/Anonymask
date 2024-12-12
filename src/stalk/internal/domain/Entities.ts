import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'anonymask', name: 'stalk' })
export class Stalk {
  @PrimaryColumn({ name: 'stalker', type: 'varchar' })
  stalker: string;
  @PrimaryColumn({ name: 'stalked', type: 'varchar' })
  stalked: string;
}

@Entity({ schema: 'anonymask', name: 'stalk_counter' })
export class StalkCounter {
  @PrimaryColumn({ name: 'user_id', type: 'varchar' })
  userId: string;
  @Column({ name: 'stalker_count', type: 'unsigned big int' })
  stalkerCount: number;
  @Column({ name: 'stalking_count', type: 'unsigned big int' })
  stalkingCount: number;
}
