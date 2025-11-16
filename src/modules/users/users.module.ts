import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './application/commands/handlers';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { UserPersistenceAdapter } from './infrastructure/adapters/persistence/user.persistence.adapter';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UserMikroOrmEntity } from './infrastructure/adapters/persistence/user.mikroorm.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

export const UsersRepositoryProvider = {
  provide: UserRepositoryPort,
  useClass: UserPersistenceAdapter,
};

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([UserMikroOrmEntity])],
  controllers: [UsersController],
  providers: [...CommandHandlers, ...QueryHandlers, UsersRepositoryProvider],
  exports: [UsersRepositoryProvider],
})
export class UsersModule {}
