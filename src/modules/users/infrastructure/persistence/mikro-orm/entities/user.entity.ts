import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity({ tableName: 'users' })
export class UserMikroOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  name: string;

  @Property({ name: 'created_at', onCreate: () => new Date() })
  createdAt: Date;
}
