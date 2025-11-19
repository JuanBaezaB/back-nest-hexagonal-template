import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { EnvEnum } from '../environment/enum/env.enum';
import { EnvironmentService } from '../environment/environment.service';
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
  ],
})
export class DatabaseModule {}
