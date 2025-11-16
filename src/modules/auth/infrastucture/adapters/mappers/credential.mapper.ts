// Mapper para la nueva entidad Credential
import { Credential } from '../../../domain/entities/credential.entity';
import { CredentialMikroOrmEntity } from '../persistence/credential.mikroorm.entity';

export class CredentialMapper {
  public static toDomain(ormEntity: CredentialMikroOrmEntity): Credential {
    return Credential.fromPersistence({
      id: ormEntity.id,
      email: ormEntity.email,
      passwordHash: ormEntity.passwordHash,
      createdAt: ormEntity.createdAt,
    });
  }

  public static toPersistence(
    domainEntity: Credential,
  ): CredentialMikroOrmEntity {
    const ormEntity = new CredentialMikroOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.email = domainEntity.email;
    ormEntity.passwordHash = domainEntity.passwordHash;
    ormEntity.createdAt = domainEntity.createdAt;
    return ormEntity;
  }
}
