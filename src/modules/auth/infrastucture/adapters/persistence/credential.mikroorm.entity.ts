import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity({ tableName: 'credentials' })
export class CredentialMikroOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ unique: true })
  email: string;

  @Property({ name: 'password_hash' })
  passwordHash: string;

  @Property({ name: 'created_at', onCreate: () => new Date() })
  createdAt: Date;
}
