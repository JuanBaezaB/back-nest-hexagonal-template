import { ConflictException, Inject } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Credential } from 'src/modules/auth/domain/entities/credential.entity';
import { UserRegisteredEvent } from 'src/modules/users/application/events/impl/user-registered.event';
import { HashingPort } from 'src/shared/application/ports/out/hashing.port';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { CredentialRepositoryPort } from '../../ports/out/credential.repository.port';
import { RegisterUserCommand } from '../impl/register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(CredentialRepositoryPort)
    private readonly credentialRepository: CredentialRepositoryPort,
    @Inject(UuidPort)
    private readonly uuidPort: UuidPort,
    @Inject(HashingPort)
    private readonly hashingPort: HashingPort,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: RegisterUserCommand,
  ): Promise<{ id: string; email: string }> {
    const { registerUserDto } = command;

    const existingCredential = await this.credentialRepository.findOneByEmail(
      registerUserDto.email,
    );

    if (existingCredential) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const hashedPassword = await this.hashingPort.hash(
      registerUserDto.password,
    );

    const newCredential = Credential.create({
      id: this.uuidPort.generate(),
      email: registerUserDto.email,
      passwordHash: hashedPassword,
    });

    await this.credentialRepository.save(newCredential);

    this.eventBus.publish(
      new UserRegisteredEvent(newCredential.id, registerUserDto.name),
    );

    return { id: newCredential.id, email: newCredential.email };
  }
}
