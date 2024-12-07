import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'anonymask', name: 'user_field_maps' })
export default class UserFieldMap {

  @PrimaryColumn({ name: 'user_id', type: 'varchar' })
  userId: string;

  @PrimaryColumn({ name: 'field_id', type: 'varchar' })
  fieldId: string;

  @Column({ name: 'value', type: 'varchar' })
  value: string;
}
