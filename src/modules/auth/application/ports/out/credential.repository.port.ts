import { Credential } from '../../../domain/entities/credential.entity';

export abstract class CredentialRepositoryPort {
  abstract save(credential: Credential): Promise<Credential>;
  abstract findOneByEmail(email: string): Promise<Credential | null>;
}
