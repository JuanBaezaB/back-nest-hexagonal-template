import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnitOfWorkPort } from 'src/shared/application/ports/out/unit-of-work.port';
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
    @Inject(UnitOfWorkPort)
    private readonly uow: UnitOfWorkPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    return this.uow.execute(async () => {
      const { createUserDto } = command;

      const newUser = User.create({
        id: this.uuidPort.generate(),
        name: createUserDto.name,
      });

      return Promise.resolve(this.userRepository.save(newUser));
    });
  }
}
