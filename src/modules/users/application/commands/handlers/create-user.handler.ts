import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { CreateUserCommand } from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(UuidPort)
    private readonly uuidPort: UuidPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { createUserPort: createUserDto } = command;

    const newUser = User.create({
      id: this.uuidPort.generate(),
      name: createUserDto.name,
    });

    return Promise.resolve(this.userRepository.save(newUser));
  }
}
