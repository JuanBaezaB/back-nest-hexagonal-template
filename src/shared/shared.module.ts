// src/shared/shared.module.ts

import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from 'src/common/database/database.module';
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

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    UuidProvider,
    TransactionManagerFactory,
    {
      provide: 'UsersTypeOrmAdapter',
      useClass: TypeOrmTransactionAdapter,
    },
    {
      provide: 'TasksMikroOrmAdapter',
      useFactory: (em: EntityManager) => new MikroOrmTransactionAdapter(em),
      inject: [getEntityManagerToken('tasks')],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionalInterceptor,
    },
  ],
  exports: [UuidProvider],
})
export class SharedModule {}
