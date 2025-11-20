import { Inject, Injectable } from '@nestjs/common';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { Task } from '../../domain/task.entity';
import { CreateTaskPort } from '../ports/in/create-task.port';
import { TaskRepositoryPort } from '../ports/out/task.repository.port';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TaskRepositoryPort)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(UuidPort)
    private readonly uuidPort: UuidPort,
  ) {}

  async execute(dto: CreateTaskPort): Promise<Task> {
    const newTask = Task.create({
      id: this.uuidPort.generate(),
      name: dto.name,
    });
    return this.taskRepository.save(newTask);
  }
}
