import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { CreateUserCommand } from '../impl/create-user.command';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { HashingPort } from 'src/shared/application/ports/out/hashing.port';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(UuidPort)
    private readonly uuidPort: UuidPort,
    @Inject(HashingPort)
    private readonly hashingPort: HashingPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { createUserDto } = command;

    const existingUser = await this.userRepository.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    let hashedPassword: string | undefined = undefined;

    if (createUserDto.password) {
      hashedPassword = await this.hashingPort.hash(createUserDto.password);
    }

    const newUser = User.create({
      id: this.uuidPort.generate(),
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
