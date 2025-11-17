import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { StringValue } from 'ms';
import ms from 'ms';
import { randomBytes } from 'node:crypto';
import { HashingPort } from 'src/shared/application/ports/out/hashing.port';
import { UnitOfWorkPort } from 'src/shared/application/ports/out/unit-of-work.port';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { AuthConfigPort } from '../../ports/out/auth-config.port';
import { TokenPort } from '../../ports/out/token.port';
import { RefreshTokenCommand } from '../impl/refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject(RefreshTokenRepositoryPort)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
    @Inject(HashingPort)
    private readonly hashingPort: HashingPort,
    @Inject(TokenPort)
    private readonly tokenPort: TokenPort,
    @Inject(UuidPort)
    private readonly uuidPort: UuidPort,
    @Inject(AuthConfigPort)
    private readonly authConfigPort: AuthConfigPort,
    @Inject(UnitOfWorkPort)
    private readonly uow: UnitOfWorkPort,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { refreshToken } = command.refreshTokenDto;
    return this.uow.execute(async () => {
      const [selector, validator] = refreshToken.split(':');
      if (!selector || !validator) {
        throw new UnauthorizedException('Formato de token inválido');
      }

      const storedToken =
        await this.refreshTokenRepo.findTokenBySelector(selector);

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      if (storedToken.isRevoked || storedToken.isExpired()) {
        throw new UnauthorizedException('Refresh token inválido o expirado');
      }

      const isMatch = await this.hashingPort.compare(
        validator,
        storedToken.validatorHash,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const userId = storedToken.userId;
      storedToken.revoke();

      await this.refreshTokenRepo.update(storedToken.id, storedToken);

      const newAccessToken = await this.tokenPort.signAsync({ sub: userId });

      const newSelector = this.uuidPort.generate();
      const newValidator = randomBytes(32).toString('hex');
      const newValidatorHash = await this.hashingPort.hash(newValidator);

      const expiresInString = this.authConfigPort.getJwtRefreshExpiration();
      const expiresInMs = ms(expiresInString as StringValue);
      const expiresAt = new Date(Date.now() + expiresInMs);

      const newTokenEntity = RefreshToken.create({
        id: this.uuidPort.generate(),
        userId: userId,
        selector: newSelector,
        validatorHash: newValidatorHash,
        expiresAt: expiresAt,
      });

      this.refreshTokenRepo.save(newTokenEntity);

      return {
        accessToken: newAccessToken,
        refreshToken: `${newSelector}:${newValidator}`,
        user: {
          id: userId,
        },
      };
    });
  }
}
