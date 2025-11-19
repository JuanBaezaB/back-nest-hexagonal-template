import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserPort } from '../ports/in/update-user.port';
import { UserRepositoryPort } from '../ports/out/user.repository.port';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateUserPort): Promise<User> {
    const updatedUser = await this.userRepository.update(id, dto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
}
