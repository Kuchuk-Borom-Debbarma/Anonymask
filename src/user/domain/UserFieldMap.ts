import { Column, Entity } from 'typeorm';

@Entity({ schema: 'anonymask', name: 'user_field_maps' })
export default class UserFieldMap {
  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;
  @Column({ name: 'field_id', type: 'varchar' })
  fieldId: string;
  @Column({ name: 'value', type: 'varchar' })
  value: string;
}
