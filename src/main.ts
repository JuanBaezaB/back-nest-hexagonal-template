import helmet from '@fastify/helmet';
import { MikroORM } from '@mikro-orm/postgresql';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvEnum } from './common/environment/enum/env.enum';
import { EnvironmentService } from './common/environment/environment.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const environmentService = app.get<EnvironmentService>(EnvironmentService);
  const loggerService = app.get<LoggerService>(LoggerService);

  await app.register(helmet);

  app.enableShutdownHooks();
  app.enableCors({ origin: true });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(
    new AllExceptionsFilter(loggerService, environmentService),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  if (environmentService.isDev()) {
    const orm = app.get(MikroORM);
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema({
      safe: true,
      dropTables: false,
    });

    const options = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API documentation for the application')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(environmentService.get(EnvEnum.PORT), '0.0.0.0');
}
bootstrap().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
