import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './application/commands/handlers';
import { RefreshTokenPersistenceAdapter } from './infrastucture/adapters/persistence/refresh-token.persistence.adapter';
import { RefreshTokenRepositoryPort } from './application/ports/out/refresh-token.repository.port';
import { AuthController } from './infrastucture/controllers/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvironmentService } from '../../common/environment/environment.service';
import { EnvEnum } from '../../common/environment/enum/env.enum';
import { StringValue } from 'ms';
import { TokenPort } from './application/ports/out/token.port';
import { AuthConfigPort } from './application/ports/out/auth-config.port';
import { AuthConfigAdapter } from './infrastucture/adapters/auth-config.adapter';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RefreshTokenMikroOrmEntity } from './infrastucture/adapters/persistence/refresh-token.mikroorm.entity';

export const RefreshTokenRepositoryProvider = {
  provide: RefreshTokenRepositoryPort,
  useClass: RefreshTokenPersistenceAdapter,
};

export const AuthConfigProvider = {
  provide: AuthConfigPort,
  useClass: AuthConfigAdapter,
};

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([RefreshTokenMikroOrmEntity]),
    JwtModule.registerAsync({
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          secret: environmentService.get(EnvEnum.JWT_ACCESS_SECRET),
          signOptions: {
            issuer: environmentService.get(EnvEnum.JWT_ISSUER),
            expiresIn: environmentService.get(
              EnvEnum.JWT_ACCESS_EXPIRATION,
            ) as StringValue,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    RefreshTokenRepositoryProvider,
    AuthConfigProvider,
    {
      provide: TokenPort,
      useExisting: JwtService,
    },
  ],
})
export class AuthModule {}
