// src/shared/shared.module.ts

import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HashingPort } from './application/ports/out/hashing.port';
import { UuidPort } from './application/ports/out/uuid.port';
import { HashingAdapter } from './infrastructure/adapters/hashing.adapter';
import { UuidAdapter } from './infrastructure/adapters/uuid.adapter';
import { TransactionalInterceptor } from './infrastructure/interceptors/transactional.interceptor';

const UuidProvider = {
  provide: UuidPort,
  useClass: UuidAdapter,
};

const HashingProvider = {
  provide: HashingPort,
  useClass: HashingAdapter,
};

const TransactionalInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: TransactionalInterceptor,
};

@Global()
@Module({
  providers: [UuidProvider, HashingProvider, TransactionalInterceptorProvider],
  exports: [UuidProvider, HashingProvider],
})
export class SharedModule {}
