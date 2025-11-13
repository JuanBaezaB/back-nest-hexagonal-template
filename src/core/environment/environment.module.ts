import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentService } from './environment.service';
import { environmentSchema } from './schema/environment.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: environmentSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
