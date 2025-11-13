import { User } from '../../../domain/entities/user.entity';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<User>;
  abstract findOneById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: string, user: Partial<User>): Promise<User | null>;
  abstract deleteById(id: string): Promise<boolean>;
}
