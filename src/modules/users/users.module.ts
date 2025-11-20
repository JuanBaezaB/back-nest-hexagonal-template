import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { UserUseCases } from './application/use-cases';
import { UserTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/user.entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/repositories/user.repository';
import { UsersController } from './presentation/controllers/users.controller';

export const UsersRepositoryProvider = {
  provide: UserRepositoryPort,
  useClass: TypeOrmUserRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [...UserUseCases, UsersRepositoryProvider],
})
export class UsersModule {}
