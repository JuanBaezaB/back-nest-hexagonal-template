import { Injectable } from '@nestjs/common';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { RefreshTokenMikroOrmEntity } from './refresh-token.mikroorm.entity';

@Injectable()
export class RefreshTokenPersistenceAdapter
  implements RefreshTokenRepositoryPort
{
  constructor(
    @InjectRepository(RefreshTokenMikroOrmEntity)
    private readonly refreshTokenRepo: EntityRepository<RefreshTokenMikroOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  async save(token: RefreshToken): Promise<RefreshToken> {
    const ormEntity = RefreshTokenMapper.toPersistence(token);
    await this.em.persistAndFlush(ormEntity);
    return RefreshTokenMapper.toDomain(ormEntity);
  }

  async findTokenBySelector(selector: string): Promise<RefreshToken | null> {
    const ormEntity = await this.refreshTokenRepo.findOne({ selector });
    return ormEntity ? RefreshTokenMapper.toDomain(ormEntity) : null;
  }

  async update(id: string, partial: Partial<RefreshToken>): Promise<boolean> {
    const ormEntity = await this.refreshTokenRepo.findOne({ id });

    if (!ormEntity) return false;

    this.em.assign(ormEntity, partial);

    await this.em.flush();

    return true;
  }
}
