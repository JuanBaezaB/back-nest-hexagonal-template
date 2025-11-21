import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { EnvEnum } from '../environment/enum/env.enum';
import { EnvironmentService } from '../environment/environment.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'users',
      useFactory: (environmentService: EnvironmentService) => ({
        type: 'postgres',
        host: environmentService.get(EnvEnum.USERS_DATABASE_HOST),
        port: environmentService.get(EnvEnum.USERS_DATABASE_PORT),
        username: environmentService.get(EnvEnum.USERS_DATABASE_USER),
        password: environmentService.get(EnvEnum.USERS_DATABASE_PASSWORD),
        database: environmentService.get(EnvEnum.USERS_DATABASE_NAME),
        schema: environmentService.get(EnvEnum.USERS_DATABASE_SCHEMA),
        autoLoadEntities: true,
        synchronize: environmentService.isDev(), // Solo en desarrollo
        logging: environmentService.isDev(),
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
      inject: [EnvironmentService],
    }),

    MikroOrmModule.forRootAsync({
      contextName: 'tasks',
      useFactory: (environmentService: EnvironmentService) => ({
        driver: PostgreSqlDriver,
        host: environmentService.get(EnvEnum.TASKS_DATABASE_HOST),
        port: environmentService.get(EnvEnum.TASKS_DATABASE_PORT),
        user: environmentService.get(EnvEnum.TASKS_DATABASE_USER),
        password: environmentService.get(EnvEnum.TASKS_DATABASE_PASSWORD),
        dbName: environmentService.get(EnvEnum.TASKS_DATABASE_NAME),
        schema: environmentService.get(EnvEnum.TASKS_DATABASE_SCHEMA),
        registerRequestContext: true,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        debug: environmentService.isDev(),

        driverOptions: {
          connection: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        },
      }),
      inject: [EnvironmentService],
      driver: PostgreSqlDriver,
    }),
  ],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
