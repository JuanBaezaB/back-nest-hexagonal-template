import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { EnvironmentModule } from './environment/environment.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [LoggerModule, EnvironmentModule, DatabaseModule],
})
export class CommonModule {}
