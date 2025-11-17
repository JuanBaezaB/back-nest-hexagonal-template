import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { UserRegisteredEvent } from '../impl/user-registered.event';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<User> {
    const { userId, name } = event;

    const user = User.create({
      id: userId,
      name,
    });

    return Promise.resolve(this.userRepository.save(user));
  }
}
