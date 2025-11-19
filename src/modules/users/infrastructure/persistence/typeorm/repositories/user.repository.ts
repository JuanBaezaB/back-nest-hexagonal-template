import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../../../application/ports/out/user.repository.port';
import { User } from '../../../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const saved = await this.repository.save(entity);
    return UserMapper.toDomain(saved);
  }

  async findOneById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map((e) => UserMapper.toDomain(e));
  }

  async update(id: string, user: User): Promise<User | null> {
    // TypeORM necesita saber que la entidad existe para hacer update
    // Usamos save() que funciona como upsert si el ID existe
    const existing = await this.repository.findOneBy({ id });
    if (!existing) return null;

    const entityToSave = UserMapper.toPersistence(user);
    const saved = await this.repository.save(entityToSave);
    return UserMapper.toDomain(saved);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
