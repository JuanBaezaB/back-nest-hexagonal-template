import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentService } from '../environment/environment.service';
import { EnvEnum } from '../environment/enum/env.enum';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (environmentService: EnvironmentService) => ({
        type: 'postgres',
        host: environmentService.get(EnvEnum.DATABASE_HOST),
        port: environmentService.get(EnvEnum.DATABASE_PORT),
        username: environmentService.get(EnvEnum.DATABASE_USER),
        password: environmentService.get(EnvEnum.DATABASE_PASSWORD),
        database: environmentService.get(EnvEnum.DATABASE_NAME),
        schema: environmentService.get(EnvEnum.DATABASE_SCHEMA),
        eepConnectionAlive: true,
        autoLoadEntities: true,
        ssl: true,
        synchronize: environmentService.isDev(),
        logging: environmentService.isDev(),
      }),
      inject: [EnvironmentService],
    }),
  ],
})
export class DatabaseModule {}
