import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { UserUseCases } from './application/use-cases';
import { UserMikroOrmEntity } from './infrastructure/persistence/mikro-orm/entities/user.entity';
import { MikroOrmUserRepository } from './infrastructure/persistence/mikro-orm/repositories/user.repository';
import { UsersController } from './presentation/controllers/users.controller';

export const UsersRepositoryProvider = {
  provide: UserRepositoryPort,
  useClass: MikroOrmUserRepository,
};

@Module({
  imports: [MikroOrmModule.forFeature([UserMikroOrmEntity])],
  controllers: [UsersController],
  providers: [...UserUseCases, UsersRepositoryProvider],
})
export class UsersModule {}
