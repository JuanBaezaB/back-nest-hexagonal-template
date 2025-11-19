import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../ports/out/user.repository.port';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
