import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';
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

  save(token: RefreshToken): RefreshToken {
    const ormEntity = RefreshTokenMapper.toPersistence(token);
    this.em.persist(ormEntity);
    return RefreshTokenMapper.toDomain(ormEntity);
  }

  async findTokenBySelector(selector: string): Promise<RefreshToken | null> {
    const ormEntity = await this.refreshTokenRepo.findOne({ selector });
    return ormEntity ? RefreshTokenMapper.toDomain(ormEntity) : null;
  }

  async update(id: string, partial: Partial<RefreshToken>): Promise<boolean> {
    const ormEntity = await this.refreshTokenRepo.findOne({ id });
    if (!ormEntity) return false;
    const updatedEntity = RefreshTokenMapper.toPersistence(
      partial as RefreshToken,
    );
    this.em.assign(ormEntity, updatedEntity);

    return true;
  }
}
