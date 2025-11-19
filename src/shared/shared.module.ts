// src/shared/shared.module.ts

import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UuidPort } from './application/ports/out/uuid.port';
import { UuidAdapter } from './infrastructure/adapters/uuid.adapter';
import { TransactionalInterceptor } from './infrastructure/interceptors/transactional.interceptor';

const UuidProvider = {
  provide: UuidPort,
  useClass: UuidAdapter,
};

const TransactionalInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: TransactionalInterceptor,
};

@Global()
@Module({
  providers: [UuidProvider, TransactionalInterceptorProvider],
  exports: [UuidProvider],
})
export class SharedModule {}
