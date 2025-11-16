import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { EnvEnum } from '../../common/environment/enum/env.enum';
import { EnvironmentService } from '../../common/environment/environment.service';
import { CommandHandlers } from './application/commands/handlers';
import { AuthConfigPort } from './application/ports/out/auth-config.port';
import { CredentialRepositoryPort } from './application/ports/out/credential.repository.port';
import { RefreshTokenRepositoryPort } from './application/ports/out/refresh-token.repository.port';
import { TokenPort } from './application/ports/out/token.port';
import { AuthConfigAdapter } from './infrastucture/adapters/auth-config.adapter';
import { CredentialMikroOrmEntity } from './infrastucture/adapters/persistence/credential.mikroorm.entity';
import { CredentialPersistenceAdapter } from './infrastucture/adapters/persistence/credential.persistence.adapter';
import { RefreshTokenMikroOrmEntity } from './infrastucture/adapters/persistence/refresh-token.mikroorm.entity';
import { RefreshTokenPersistenceAdapter } from './infrastucture/adapters/persistence/refresh-token.persistence.adapter';
import { AuthController } from './infrastucture/controllers/auth.controller';

export const RefreshTokenRepositoryProvider = {
  provide: RefreshTokenRepositoryPort,
  useClass: RefreshTokenPersistenceAdapter,
};

export const AuthConfigProvider = {
  provide: AuthConfigPort,
  useClass: AuthConfigAdapter,
};

export const CredentialRepositoryProvider = {
  provide: CredentialRepositoryPort,
  useClass: CredentialPersistenceAdapter,
};

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([
      RefreshTokenMikroOrmEntity,
      CredentialMikroOrmEntity,
    ]),
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
    CredentialRepositoryProvider,
    AuthConfigProvider,
    {
      provide: TokenPort,
      useExisting: JwtService,
    },
  ],
})
export class AuthModule {}
