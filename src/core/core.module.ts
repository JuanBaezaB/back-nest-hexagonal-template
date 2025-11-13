import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { EnvironmentModule } from './environment/environment.module';

@Module({
  imports: [LoggerModule, EnvironmentModule],
})
export class CoreModule {}
