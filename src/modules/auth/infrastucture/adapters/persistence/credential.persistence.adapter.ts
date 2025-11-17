// Implementación del adaptador de persistencia para Credential
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CredentialRepositoryPort } from '../../../application/ports/out/credential.repository.port';
import { Credential } from '../../../domain/entities/credential.entity';
import { CredentialMapper } from '../mappers/credential.mapper';
import { CredentialMikroOrmEntity } from './credential.mikroorm.entity';

@Injectable()
export class CredentialPersistenceAdapter implements CredentialRepositoryPort {
  constructor(
    @InjectRepository(CredentialMikroOrmEntity)
    private readonly credentialOrmRepository: EntityRepository<CredentialMikroOrmEntity>,
    private readonly em: EntityManager,
  ) {}

  save(credential: Credential): Credential {
    const ormEntity = CredentialMapper.toPersistence(credential);
    this.em.persist(ormEntity);
    return CredentialMapper.toDomain(ormEntity);
  }

  async findOneByEmail(email: string): Promise<Credential | null> {
    const ormEntity = await this.credentialOrmRepository.findOne({ email });
    return ormEntity ? CredentialMapper.toDomain(ormEntity) : null;
  }
}
