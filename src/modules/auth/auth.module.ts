import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './application/commands/handlers';
import { RefreshTokenPersistenceAdapter } from './infrastucture/adapters/persistence/refresh-token.persistence.adapter';
import { RefreshTokenRepositoryPort } from './application/ports/out/refresh-token.repository.port';
import { AuthController } from './infrastucture/controllers/auth.controller';
import { RefreshTokenTypeOrmEntity } from './infrastucture/adapters/persistence/refresh-token.typeorm.entity';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentService } from 'src/core/environment/environment.service';
import { EnvEnum } from 'src/core/environment/enum/env.enum';
import { UsersModule } from '../users/users.module';
import { HashingService } from 'src/core/services/hashing.service';

export const RefreshTokenRepositoryProvider = {
  provide: RefreshTokenRepositoryPort,
  useClass: RefreshTokenPersistenceAdapter,
};

@Module({
  imports: [
    UsersModule,
    CqrsModule,
    TypeOrmModule.forFeature([RefreshTokenTypeOrmEntity]),
    JwtModule.registerAsync({
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          signOptions: {
            issuer: environmentService.get(EnvEnum.JWT_ISSUER),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    RefreshTokenRepositoryProvider,
    HashingService,
  ],
})
export class AuthModule {}
