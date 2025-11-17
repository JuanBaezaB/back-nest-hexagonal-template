import { EntityManager } from '@mikro-orm/postgresql'; // O '@mikro-orm/core'
import { Injectable } from '@nestjs/common';
import { UnitOfWorkPort } from '../../application/ports/out/unit-of-work.port';

@Injectable()
export class MikroOrmUnitOfWorkAdapter implements UnitOfWorkPort {
  constructor(private readonly em: EntityManager) {}

  /**
   * Ejecuta el trabajo usando 'em.transactional'.
   * Esto inicia la transacción, ejecuta el 'work',
   * hace COMMIT si tiene éxito, y ROLLBACK si falla.
   */
  async execute<T>(work: () => Promise<T>): Promise<T> {
    return this.em.transactional(work);
  }
}
