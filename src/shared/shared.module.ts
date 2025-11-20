// src/shared/shared.module.ts

import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UuidPort } from './application/ports/out/uuid.port';
import { MikroOrmTransactionAdapter } from './infrastructure/adapters/mikroorm-transaction.adapter';
import { TypeOrmTransactionAdapter } from './infrastructure/adapters/typeorm-transaction.adapter';
import { UuidAdapter } from './infrastructure/adapters/uuid.adapter';
import { TransactionManagerFactory } from './infrastructure/factories/transaction-manager.factory';
import { TransactionalInterceptor } from './infrastructure/interceptors/transactional.interceptor';

const UuidProvider = {
  provide: UuidPort,
  useClass: UuidAdapter,
};

const TypeOrmTransactionProvider = {
  provide: 'TypeOrmAdapter',
  useClass: TypeOrmTransactionAdapter,
};

const MikroOrmTransactionProvider = {
  provide: 'MikroOrmAdapter',
  useClass: MikroOrmTransactionAdapter,
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
    TransactionManagerFactory,
    {
      provide: 'TypeOrmAdapter',
      useClass: TypeOrmTransactionAdapter,
    },
    {
      provide: 'MikroOrmAdapter',
      useClass: MikroOrmTransactionAdapter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionalInterceptor,
    },
  ],
  exports: [UuidProvider],
})
export class SharedModule { }
