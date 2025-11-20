import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../../domain/task.entity';
import { TaskRepositoryPort } from '../ports/out/task.repository.port';

@Injectable()
export class GetAllTasksUseCase {
  constructor(
    @Inject(TaskRepositoryPort)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
