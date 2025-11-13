import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './infrastructure/adapters/persistence/user.typeorm.entity';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { UserPersistenceAdapter } from './infrastructure/adapters/persistence/user.persistence.adapter';
import { CqrsModule } from '@nestjs/cqrs'; // <-- 1. Importar CqrsModule

// 2. Importar todos los Handlers
import { CreateUserHandler } from './application/commands/handlers/create-user.handler';
import { UpdateUserHandler } from './application/commands/handlers/update-user.handler';
import { DeleteUserHandler } from './application/commands/handlers/delete-user.handler';
import { GetAllUsersHandler } from './application/queries/handlers/get-all-users.handler';
import { GetUserByIdHandler } from './application/queries/handlers/get-user-by-id.handler';

// 3. Crear listas para mantener el módulo limpio
export const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
export const QueryHandlers = [GetAllUsersHandler, GetUserByIdHandler];

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
