import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './application/commands/handlers';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { UserPersistenceAdapter } from './infrastructure/adapters/persistence/user.persistence.adapter';
import { UserTypeOrmEntity } from './infrastructure/adapters/persistence/user.typeorm.entity';
import { UsersController } from './infrastructure/controllers/users.controller';

export const UsersRepositoryProvider = {
  provide: UserRepositoryPort,
  useClass: UserPersistenceAdapter,
};

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [...CommandHandlers, ...QueryHandlers, UsersRepositoryProvider],
  exports: [UsersRepositoryProvider],
})
export class UsersModule {}
