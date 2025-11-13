import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../../application/ports/out/user.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './user.typeorm.entity';
import { Repository } from 'typeorm';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserPersistenceAdapter implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly userOrmRepository: Repository<UserTypeOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const ormEntity = UserMapper.toPersistence(user);
    const savedEntity = await this.userOrmRepository.save(ormEntity);
    return UserMapper.toDomain(savedEntity);
  }

  async findOneById(id: string): Promise<User | null> {
    const ormEntity = await this.userOrmRepository.findOneBy({ id });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const ormEntity = await this.userOrmRepository.findOneBy({ email });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<User[]> {
    const ormEntities = await this.userOrmRepository.find();
    return ormEntities.map((user) => UserMapper.toDomain(user));
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const exists = await this.userOrmRepository.existsBy({ id });
    if (!exists) return null;
    await this.userOrmRepository.update(id, UserMapper.toPersistence(user));
    return this.findOneById(id);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.userOrmRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
