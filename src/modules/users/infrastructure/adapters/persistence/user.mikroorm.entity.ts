import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity({ tableName: 'users' })
export class UserMikroOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ unique: true })
  email: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  password?: string;

  @Property({ name: 'created_at', onCreate: () => new Date() })
  createdAt: Date;
}
