import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './application/commands/handlers';
import { EventHandlers } from './application/events/handlers';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { UserMikroOrmEntity } from './infrastructure/adapters/persistence/user.mikroorm.entity';
import { UserPersistenceAdapter } from './infrastructure/adapters/persistence/user.persistence.adapter';
import { UsersController } from './presentation/controllers/users.controller';

export const UsersRepositoryProvider = {
  provide: UserRepositoryPort,
  useClass: UserPersistenceAdapter,
};

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([UserMikroOrmEntity])],
  controllers: [UsersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UsersRepositoryProvider,
  ],
  exports: [UsersRepositoryProvider],
})
export class UsersModule {}
