import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './infrastructure/adapters/persistence/user.typeorm.entity';
import { UsersService } from './application/use-cases/users.service';
import { UserRepositoryPort } from './application/ports/out/user.repository.port';
import { UserPersistenceAdapter } from './infrastructure/adapters/persistence/user.persistence.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepositoryPort,
      useClass: UserPersistenceAdapter,
    },
  ],
})
export class UsersModule {}
