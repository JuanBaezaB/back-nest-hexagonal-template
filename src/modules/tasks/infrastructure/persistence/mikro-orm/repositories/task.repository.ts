import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Task } from 'src/modules/tasks/domain/task.entity';
import { TaskRepositoryPort } from '../../../../application/ports/out/task.repository.port';
import { TaskMikroOrmEntity } from '../entities/task.entity';
import { TaskMapper } from '../mappers/task.mapper';

@Injectable()
export class MikroOrmTaskRepository implements TaskRepositoryPort {
  constructor(
    @InjectRepository(TaskMikroOrmEntity)
    private readonly taskOrmRepository: EntityRepository<TaskMikroOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  async save(task: Task): Promise<Task> {
    const ormEntity = TaskMapper.toPersistence(task);
    this.em.persist(ormEntity);
    return Promise.resolve(TaskMapper.toDomain(ormEntity));
  }

  async findOneById(id: string): Promise<Task | null> {
    const ormEntity = await this.taskOrmRepository.findOne({ id });
    return ormEntity ? TaskMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Task[]> {
    const ormEntities = await this.taskOrmRepository.findAll();
    return ormEntities.map((task) => TaskMapper.toDomain(task));
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    const ormEntity = await this.taskOrmRepository.findOne({ id });
    if (!ormEntity) return null;

    const partial = TaskMapper.toPersistence(task);

    this.em.assign(ormEntity, partial);

    return TaskMapper.toDomain(ormEntity);
  }

  async deleteById(id: string): Promise<boolean> {
    const affected = await this.em.nativeDelete(TaskMikroOrmEntity, { id });
    return affected > 0;
  }
}
