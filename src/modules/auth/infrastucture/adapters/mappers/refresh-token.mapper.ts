import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenMikroOrmEntity } from '../persistence/refresh-token.mikroorm.entity';

export class RefreshTokenMapper {
  public static toDomain(ormEntity: RefreshTokenMikroOrmEntity): RefreshToken {
    return RefreshToken.fromPersistence({
      id: ormEntity.id,
      userId: ormEntity.userId,
      selector: ormEntity.selector,
      validatorHash: ormEntity.validatorHash,
      isRevoked: ormEntity.isRevoked,
      expiresAt: ormEntity.expiresAt,
      createdAt: ormEntity.createdAt,
    });
  }

  public static toPersistence(
    domainEntity: RefreshToken,
  ): RefreshTokenMikroOrmEntity {
    const ormEntity = new RefreshTokenMikroOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.userId = domainEntity.userId;
    ormEntity.selector = domainEntity.selector;
    ormEntity.validatorHash = domainEntity.validatorHash;
    ormEntity.isRevoked = domainEntity.isRevoked;
    ormEntity.expiresAt = domainEntity.expiresAt;
    ormEntity.createdAt = domainEntity.createdAt;
    return ormEntity;
  }
}
