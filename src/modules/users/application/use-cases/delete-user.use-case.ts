import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from '../ports/out/user.repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
