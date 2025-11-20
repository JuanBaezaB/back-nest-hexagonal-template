import { Task } from 'src/modules/tasks/domain/task.entity';
import { TaskMikroOrmEntity } from '../entities/task.entity';

export class TaskMapper {
  static toDomain(entity: TaskMikroOrmEntity): Task {
    return Task.fromPersistence({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    });
  }

  static toPersistence(task: Partial<Task>): TaskMikroOrmEntity {
    const entity = new TaskMikroOrmEntity();
    if (task.id) entity.id = task.id;
    if (task.name) entity.name = task.name;
    if (task.createdAt) entity.createdAt = task.createdAt;
    return entity;
  }
}
