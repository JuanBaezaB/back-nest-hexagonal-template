import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { UserRepositoryPort } from 'src/modules/users/application/ports/out/user.repository.port';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { RegisterUserCommand } from '../impl/register-user.command';
import { HashingPort } from '../../ports/out/hashing.port';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HashingPort)
    private readonly hashingPort: HashingPort,
    @Inject(UuidPort)
    private readonly uuidPort: UuidPort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { email, name, password } = command.registerUserDto;

    const existingUser = await this.userRepository.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const hashedPassword = await this.hashingPort.hash(password);

    const newUser = User.create({
      id: this.uuidPort.generate(),
      email,
      name,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }
}
