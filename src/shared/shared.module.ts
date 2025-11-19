// src/shared/shared.module.ts

import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionManagerPort } from './application/ports/out/transaction-manager.port';
import { UuidPort } from './application/ports/out/uuid.port';
import { TypeOrmTransactionAdapter } from './infrastructure/adapters/typeorm-transaction.adapter';
import { UuidAdapter } from './infrastructure/adapters/uuid.adapter';
import { TransactionalInterceptor } from './infrastructure/interceptors/transactional.interceptor';

const UuidProvider = {
  provide: UuidPort,
  useClass: UuidAdapter,
};

const TransactionManagerProvider = {
  provide: TransactionManagerPort,
  useClass: TypeOrmTransactionAdapter,
};

// Proveedor del Interceptor Global
const TransactionalInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: TransactionalInterceptor,
};

@Global()
@Module({
  providers: [
    UuidProvider,
    TransactionManagerProvider,
    TransactionalInterceptorProvider,
  ],
  exports: [UuidProvider, TransactionManagerPort],
})
export class SharedModule {}
