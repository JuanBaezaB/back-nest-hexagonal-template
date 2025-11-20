import { Injectable } from '@nestjs/common';
import { runInTransaction } from 'typeorm-transactional';
import { TransactionManagerPort } from '../../application/ports/out/transaction-manager.port';

@Injectable()
export class TypeOrmTransactionAdapter implements TransactionManagerPort {
  runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return runInTransaction(fn);
  }
}
