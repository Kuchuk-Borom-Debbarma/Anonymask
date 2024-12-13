import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'users' })
export default class User {
  @PrimaryColumn({ type: 'varchar', name: 'id' })
  userId: string;
  @Column({ name: 'username', type: 'varchar' })
  username: string;

}
