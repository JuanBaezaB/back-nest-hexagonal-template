import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
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
