import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HashingService } from 'src/core/services/hashing.service';
import { UserRepositoryPort } from 'src/modules/users/application/ports/out/user.repository.port';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { RegisterUserCommand } from '../impl/register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { email, name, password } = command.registerUserDto;

    const existingUser = await this.userRepository.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const hashedPassword = await this.hashingService.hash(password);

    const newUser = new User({
      id: randomUUID(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const savedUser = await this.userRepository.save(newUser);

    delete savedUser.password;
    return savedUser;
  }
}
