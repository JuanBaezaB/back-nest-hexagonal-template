import { Inject, Injectable } from '@nestjs/common';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { User } from '../../domain/entities/user.entity';
import { CreateUserPort } from '../ports/in/create-user.port';
import { UserRepositoryPort } from '../ports/out/user.repository.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(UuidPort)
    private readonly uuidPort: UuidPort,
  ) {}

  async execute(dto: CreateUserPort): Promise<User> {
    const newUser = User.create({
      id: this.uuidPort.generate(),
      name: dto.name,
    });
    return this.userRepository.save(newUser);
  }
}
