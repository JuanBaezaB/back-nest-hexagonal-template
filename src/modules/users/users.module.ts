import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { UserUseCases } from './application/use-cases';
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
  providers: [...UserUseCases, UsersRepositoryProvider],
  exports: [UsersRepositoryProvider],
})
export class UsersModule {}
