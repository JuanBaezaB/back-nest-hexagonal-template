import { User } from '../../../domain/entities/user.entity';
import { UserMikroOrmEntity } from '../persistence/user.mikroorm.entity';

// Clase estática para mapear entre el dominio y la persistencia
export class UserMapper {
  public static toDomain(ormEntity: UserMikroOrmEntity): User {
    return User.fromPersistence({
      id: ormEntity.id,
      email: ormEntity.email,
      name: ormEntity.name,
      password: ormEntity.password,
      createdAt: ormEntity.createdAt,
    });
  }

  public static toPersistence(domainEntity: Partial<User>): UserMikroOrmEntity {
    const ormEntity = new UserMikroOrmEntity();
    if (domainEntity.id) ormEntity.id = domainEntity.id;
    if (domainEntity.email) ormEntity.email = domainEntity.email;
    if (domainEntity.name) ormEntity.name = domainEntity.name;
    if (domainEntity.password) ormEntity.password = domainEntity.password;
    if (domainEntity.createdAt) ormEntity.createdAt = domainEntity.createdAt;
    return ormEntity;
  }
}
