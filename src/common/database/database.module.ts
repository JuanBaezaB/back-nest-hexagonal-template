import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EnvironmentService } from '../environment/environment.service';
import { EnvEnum } from '../environment/enum/env.enum';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        driver: PostgreSqlDriver,
        host: environmentService.get(EnvEnum.DATABASE_HOST),
        port: environmentService.get(EnvEnum.DATABASE_PORT),
        user: environmentService.get(EnvEnum.DATABASE_USER),
        password: environmentService.get(EnvEnum.DATABASE_PASSWORD),
        dbName: environmentService.get(EnvEnum.DATABASE_NAME),
        schema: environmentService.get(EnvEnum.DATABASE_SCHEMA),
        autoLoadEntities: true, // Esto descubrirá tus entidades automáticamente
        synchronize: environmentService.isDev(), // synchronize: true es genial para desarrollo
        logging: environmentService.isDev(),
        keepConnectionAlive: true,
        driverOptions: {
          connection: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
