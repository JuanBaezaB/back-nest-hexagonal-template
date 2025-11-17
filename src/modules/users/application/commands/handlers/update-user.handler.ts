import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnitOfWorkPort } from 'src/shared/application/ports/out/unit-of-work.port';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { UpdateUserCommand } from '../impl/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(UnitOfWorkPort)
    private readonly uow: UnitOfWorkPort,
  ) {}

  async execute(command: UpdateUserCommand) {
    return this.uow.execute(async () => {
      const { id, updateUserPort: updateUserDto } = command;
      const updatedUser = await this.userRepository.update(id, updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    });
  }
}
