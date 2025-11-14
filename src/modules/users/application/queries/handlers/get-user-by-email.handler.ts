import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { User } from '../../../../users/domain/entities/user.entity';
import { GetUserByEmailQuery } from '../impl/get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    const { email } = query;
    return this.userRepository.findOneByEmail(email);
  }
}
