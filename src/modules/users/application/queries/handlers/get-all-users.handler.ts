import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { GetAllUsersQuery } from '../impl/get-all-users.query';
import { User } from '../../../../users/domain/entities/user.entity';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
