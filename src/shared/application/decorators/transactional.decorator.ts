// src/shared/application/decorators/transactional.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ConnectionName } from '../../domain/enums/connection-name.enum';

export const TRANSACTIONAL_KEY = 'TRANSACTIONAL_KEY';

export interface TransactionMetadata {
  connectionName: ConnectionName;
  timeout?: number;
  isolationLevel?:
    | 'READ_UNCOMMITTED'
    | 'READ_COMMITTED'
    | 'REPEATABLE_READ'
    | 'SERIALIZABLE';
}

export const Transactional = (
  connectionName: ConnectionName,
  options?: Omit<TransactionMetadata, 'connectionName'>,
): MethodDecorator =>
  SetMetadata(TRANSACTIONAL_KEY, {
    connectionName,
    ...options,
  } as TransactionMetadata);
