import { Task } from '../../../../tasks/domain/task.entity';

export abstract class TaskRepositoryPort {
  abstract save(task: Task): Promise<Task>;
  abstract findOneById(id: string): Promise<Task | null>;
  abstract findAll(): Promise<Task[]>;
  abstract update(id: string, task: Partial<Task>): Promise<Task | null>;
  abstract deleteById(id: string): Promise<boolean>;
}
