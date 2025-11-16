// src/modules/auth/infrastucture/adapters/persistence/refresh-token.entity.ts
import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/postgresql';

@Entity({ tableName: 'refresh_tokens' })
export class RefreshTokenMikroOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Index({ name: 'index_refresh_token_user_id' })
  @Property({ name: 'user_id' })
  userId: string;

  @Index({ name: 'index_refresh_token_selector' })
  @Property({ unique: true })
  selector: string;

  @Property({ name: 'validator_hash' })
  validatorHash: string;

  @Property({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Property({ name: 'expires_at' })
  expiresAt: Date;

  @Property({ name: 'created_at', onCreate: () => new Date() })
  createdAt: Date;
}
