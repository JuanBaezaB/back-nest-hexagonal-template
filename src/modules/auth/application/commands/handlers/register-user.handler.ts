import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { RegisterUserCommand } from '../impl/register-user.command';
import { CreateUserCommand } from 'src/modules/users/application/commands/impl/create-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    return this.commandBus.execute<CreateUserCommand, User>(
      new CreateUserCommand(command.registerUserDto),
    );
  }
}
