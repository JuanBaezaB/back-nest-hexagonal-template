import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenTypeOrmEntity } from '../persistence/refresh-token.typeorm.entity';

export class RefreshTokenMapper {
  public static toDomain(ormEntity: RefreshTokenTypeOrmEntity): RefreshToken {
    return new RefreshToken({
      id: ormEntity.id,
      userId: ormEntity.userId,
      tokenHash: ormEntity.tokenHash,
      isRevoked: ormEntity.isRevoked,
      expiresAt: ormEntity.expiresAt,
      createdAt: ormEntity.createdAt,
    });
  }

  public static toPersistence(
    domainEntity: RefreshToken,
  ): RefreshTokenTypeOrmEntity {
    const ormEntity = new RefreshTokenTypeOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.userId = domainEntity.userId;
    ormEntity.tokenHash = domainEntity.tokenHash;
    ormEntity.isRevoked = domainEntity.isRevoked;
    ormEntity.expiresAt = domainEntity.expiresAt;
    ormEntity.createdAt = domainEntity.createdAt;
    return ormEntity;
  }
}
