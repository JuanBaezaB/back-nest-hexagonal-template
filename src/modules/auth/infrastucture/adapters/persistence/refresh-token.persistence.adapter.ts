import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';
import { RefreshTokenTypeOrmEntity } from './refresh-token.typeorm.entity';

@Injectable()
export class RefreshTokenPersistenceAdapter
  implements RefreshTokenRepositoryPort
{
  constructor(
    @InjectRepository(RefreshTokenTypeOrmEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenTypeOrmEntity>,
  ) {}

  async save(token: RefreshToken): Promise<RefreshToken> {
    const ormEntity = RefreshTokenMapper.toPersistence(token);
    const savedEntity = await this.refreshTokenRepo.save(ormEntity);
    return RefreshTokenMapper.toDomain(savedEntity);
  }

  async findTokenBySelector(selector: string): Promise<RefreshToken | null> {
    const ormEntity = await this.refreshTokenRepo.findOne({
      where: { selector },
    });
    return ormEntity ? RefreshTokenMapper.toDomain(ormEntity) : null;
  }
  async update(id: string, partial: Partial<RefreshToken>): Promise<boolean> {
    const result = await this.refreshTokenRepo.update(id, partial);
    return (result.affected ?? 0) > 0;
  }
}
