import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
