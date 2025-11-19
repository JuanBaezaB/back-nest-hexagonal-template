export abstract class TransactionManagerPort {
  /**
   * Ejecuta una función dentro de un contexto transaccional.
   */
  abstract runInTransaction<T>(fn: () => Promise<T>, options?: any): Promise<T>;
}
