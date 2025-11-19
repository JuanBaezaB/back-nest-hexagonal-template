import { User } from '../../../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserTypeOrmEntity): User {
    return User.fromPersistence({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    });
  }

  static toPersistence(user: User): UserTypeOrmEntity {
    const entity = new UserTypeOrmEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.createdAt = user.createdAt;
    return entity;
  }
}
