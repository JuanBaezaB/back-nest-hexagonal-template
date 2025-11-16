import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../../application/ports/out/user.repository.port';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserMapper } from '../mappers/user.mapper';
import { UserMikroOrmEntity } from './user.mikroorm.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class UserPersistenceAdapter implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserMikroOrmEntity)
    private readonly userOrmRepository: EntityRepository<UserMikroOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  async save(user: User): Promise<User> {
    const ormEntity = UserMapper.toPersistence(user);
    await this.em.persistAndFlush(ormEntity);
    return UserMapper.toDomain(ormEntity);
  }

  async findOneById(id: string): Promise<User | null> {
    const ormEntity = await this.userOrmRepository.findOne({ id });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const ormEntity = await this.userOrmRepository.findOne({ email });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<User[]> {
    const ormEntities = await this.userOrmRepository.findAll();
    return ormEntities.map((user) => UserMapper.toDomain(user));
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const ormEntity = await this.userOrmRepository.findOne({ id });
    if (!ormEntity) return null;

    const partial = UserMapper.toPersistence(user);

    this.em.assign(ormEntity, partial);
    await this.em.flush();

    return UserMapper.toDomain(ormEntity);
  }

  async deleteById(id: string): Promise<boolean> {
    const affected = await this.em.nativeDelete(UserMikroOrmEntity, { id });
    return affected > 0;
  }
}
