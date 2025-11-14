import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ unique: true })
  selector: string;

  @Column({ name: 'token_hash' })
  validatorHash: string;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
