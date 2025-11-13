import { User } from '../../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../persistence/user.typeorm.entity';

// Clase estática para mapear entre el dominio y la persistencia
export class UserMapper {
  public static toDomain(ormEntity: UserTypeOrmEntity): User {
    return new User({
      id: ormEntity.id,
      email: ormEntity.email,
      name: ormEntity.name,
      createdAt: ormEntity.createdAt,
    });
  }

  public static toPersistence(domainEntity: Partial<User>): UserTypeOrmEntity {
    const ormEntity = new UserTypeOrmEntity();
    if (domainEntity.id) ormEntity.id = domainEntity.id;
    if (domainEntity.email) ormEntity.email = domainEntity.email;
    if (domainEntity.name) ormEntity.name = domainEntity.name;
    if (domainEntity.createdAt) ormEntity.createdAt = domainEntity.createdAt;
    return ormEntity;
  }
}
