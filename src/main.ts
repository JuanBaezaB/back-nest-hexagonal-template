import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { EnvironmentService } from './common/environment/environment.service';
import { LoggerService } from './common/logger/logger.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvEnum } from './common/environment/enum/env.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const environmentService = app.get<EnvironmentService>(EnvironmentService);
  const loggerService = app.get<LoggerService>(LoggerService);

  app.enableCors({ origin: true });
  app.use(helmet());
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
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  if (environmentService.isDev()) {
    const options = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API documentation for the application')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(environmentService.get(EnvEnum.PORT));
}
bootstrap().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
