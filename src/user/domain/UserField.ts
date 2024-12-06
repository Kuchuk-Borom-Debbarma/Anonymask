import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'anonymask', name: 'user_fields' })
export default class UserField {
  @PrimaryColumn({ type: 'varchar', name: 'id' })
  fieldId: string;
  @Column({ name: 'field_name', type: 'varchar' })
  fieldName: string;
  @Column({ name: 'field_type', type: 'varchar' })
  fieldType: string; //json string
}
