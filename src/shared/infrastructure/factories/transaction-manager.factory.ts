// src/shared/infrastructure/factories/transaction-manager.factory.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TransactionManagerPort } from '../../application/ports/out/transaction-manager.port';
import { ConnectionName } from '../../domain/enums/connection-name.enum';

@Injectable()
export class TransactionManagerFactory {
  private readonly managers: Map<ConnectionName, TransactionManagerPort>;

  constructor(
    @Inject('TypeOrmAdapter') private typeOrmAdapter: TransactionManagerPort,
    @Inject('MikroOrmAdapter') private mikroOrmAdapter: TransactionManagerPort,
  ) {
    // Mapea nombres lógicos a implementaciones
    this.managers = new Map([
      [ConnectionName.DEFAULT, this.typeOrmAdapter],
      [ConnectionName.ANALYTICS, this.mikroOrmAdapter],
    ]);
  }

  /**
   * Obtiene el gestor de transacciones para una conexión lógica
   * @param connectionName Nombre lógico de la conexión
   * @returns Gestor de transacciones
   * @throws BadRequestException si el nombre no existe
   */
  getManager(connectionName: ConnectionName): TransactionManagerPort {
    const manager = this.managers.get(connectionName);

    if (!manager) {
      throw new BadRequestException(
        `Transaction manager for connection "${connectionName}" not found`
      );
    }

    return manager;
  }

  /**
   * Obtiene todos los nombres de conexiones disponibles
   */
  getAvailableConnections(): ConnectionName[] {
    return Array.from(this.managers.keys());
  }
}