import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TaskRepositoryPort } from './application/ports/out/task.repository.port';
import { TaskUseCases } from './application/use-cases';
import { TaskMikroOrmEntity } from './infrastructure/persistence/mikro-orm/entities/task.entity';
import { MikroOrmTaskRepository } from './infrastructure/persistence/mikro-orm/repositories/task.repository';
import { TasksController } from './presentation/controllers/tasks.controller';

export const TaskRepositoryProvider = {
  provide: TaskRepositoryPort,
  useClass: MikroOrmTaskRepository,
};

@Module({
  imports: [MikroOrmModule.forFeature([TaskMikroOrmEntity])],
  controllers: [TasksController],
  providers: [...TaskUseCases, TaskRepositoryProvider],
})
export class TasksModule {}
