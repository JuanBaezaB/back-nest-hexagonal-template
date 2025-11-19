import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EnvironmentModule } from './environment/environment.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [HealthModule, LoggerModule, EnvironmentModule, DatabaseModule],
})
export class CommonModule {}
