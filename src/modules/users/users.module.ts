import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs'; // <-- 1. Importar CqrsModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './application/commands/handlers';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { UserPersistenceAdapter } from './infrastructure/adapters/persistence/user.persistence.adapter';
import { UserTypeOrmEntity } from './infrastructure/adapters/persistence/user.typeorm.entity';
import { UsersController } from './infrastructure/controllers/users.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: UserRepositoryPort,
      useClass: UserPersistenceAdapter,
    },
  ],
})
export class UsersModule {}
