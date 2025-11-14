import { RefreshToken } from '../../../domain/entities/refresh-token.entity';

export abstract class RefreshTokenRepositoryPort {
  abstract save(token: RefreshToken): Promise<RefreshToken>;
  abstract findTokenBySelector(selector: string): Promise<RefreshToken | null>;
  abstract update(id: string, partial: Partial<RefreshToken>): Promise<boolean>;
}
