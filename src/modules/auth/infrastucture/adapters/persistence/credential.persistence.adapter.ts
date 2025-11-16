// Implementación del adaptador de persistencia para Credential
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Credential } from '../../../domain/entities/credential.entity';
import { CredentialRepositoryPort } from '../../../application/ports/out/credential.repository.port';
import { CredentialMikroOrmEntity } from './credential.mikroorm.entity';
import { CredentialMapper } from '../mappers/credential.mapper';

@Injectable()
export class CredentialPersistenceAdapter implements CredentialRepositoryPort {
  constructor(
    @InjectRepository(CredentialMikroOrmEntity)
    private readonly credentialOrmRepository: EntityRepository<CredentialMikroOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  async save(credential: Credential): Promise<Credential> {
    const ormEntity = CredentialMapper.toPersistence(credential);
    await this.em.persistAndFlush(ormEntity);
    return CredentialMapper.toDomain(ormEntity);
  }

  async findOneByEmail(email: string): Promise<Credential | null> {
    const ormEntity = await this.credentialOrmRepository.findOne({ email });
    return ormEntity ? CredentialMapper.toDomain(ormEntity) : null;
  }
}
