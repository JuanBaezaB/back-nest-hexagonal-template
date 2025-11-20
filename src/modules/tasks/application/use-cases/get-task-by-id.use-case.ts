import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../domain/task.entity';
import { TaskRepositoryPort } from '../ports/out/task.repository.port';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(
    @Inject(TaskRepositoryPort)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }
}
