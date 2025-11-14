import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { CreateUserCommand } from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { createUserDto } = command;
    const newUser = User.create({
      email: createUserDto.email,
      name: createUserDto.name,
    });
    return this.userRepository.save(newUser);
  }
}
