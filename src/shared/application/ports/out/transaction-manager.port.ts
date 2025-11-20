export abstract class TransactionManagerPort {
  abstract runInTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
