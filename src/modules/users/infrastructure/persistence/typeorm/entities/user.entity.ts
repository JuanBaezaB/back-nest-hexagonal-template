import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
