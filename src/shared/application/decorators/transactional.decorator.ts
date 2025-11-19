import { SetMetadata } from '@nestjs/common';

export const TRANSACTIONAL_KEY = 'IS_TRANSACTIONAL';

// Opciones genéricas (aisladas de TypeORM)
export interface TransactionOptions {
  isolationLevel?:
    | 'READ UNCOMMITTED'
    | 'READ COMMITTED'
    | 'REPEATABLE READ'
    | 'SERIALIZABLE';
}

export const Transactional = (options?: TransactionOptions) =>
  SetMetadata(TRANSACTIONAL_KEY, options || true);
