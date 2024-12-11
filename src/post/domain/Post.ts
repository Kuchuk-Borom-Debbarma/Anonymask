import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'anonymask', name: 'posts' })
export default class Post {
  @PrimaryColumn({ type: 'varchar', name: 'post_id' })
  postID: string;
  @Column({ name: 'title', type: 'varchar' })
  title: string;
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;
  @Column({ name: 'content', type: 'text' })
  content: string;
}