import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { TransactionManagerPort } from '../../application/ports/out/transaction-manager.port';

@Injectable()
export class MikroOrmTransactionAdapter implements TransactionManagerPort {
  constructor(private readonly em: EntityManager) {}

  async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return await this.em.transactional(async () => {
      return await fn();
    });
  }
}
