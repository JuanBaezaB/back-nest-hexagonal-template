import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepositoryPort } from '../ports/out/task.repository.port';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TaskRepositoryPort)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.taskRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
