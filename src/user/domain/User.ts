import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'anonymask', name: 'users' })
export default class User {
  @PrimaryColumn({ type: 'varchar', name: 'id' })
  userId: string;
  @Column({ name: 'username', type: 'varchar' })
  username: string;
  @Column({ name: 'password', type: 'varchar' })
  passwordHashed: string;
}
