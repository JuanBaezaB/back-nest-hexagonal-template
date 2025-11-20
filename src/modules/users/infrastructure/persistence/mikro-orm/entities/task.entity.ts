import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity({ tableName: 'tasks' })
export class TaskMikroOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  name: string;

  @Property({ name: 'created_at', onCreate: () => new Date() })
  createdAt: Date;
}
