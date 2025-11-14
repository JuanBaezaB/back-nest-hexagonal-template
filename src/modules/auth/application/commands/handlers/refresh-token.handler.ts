import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';
import { EnvironmentService } from 'src/core/environment/environment.service';
import { EnvEnum } from 'src/core/environment/enum/env.enum';
import type { StringValue } from 'ms';
import ms from 'ms';
import { HashingPort } from '../../ports/out/hashing.port';
import { TokenPort } from '../../ports/out/token.port';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';

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
    private readonly environmentService: EnvironmentService,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { refreshToken } = command.refreshTokenDto;

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

    await this.refreshTokenRepo.update(storedToken.id, { isRevoked: true });

    const newAccessToken = this.tokenPort.sign({ sub: userId });

    const newSelector = randomUUID();
    const newValidator = randomBytes(32).toString('hex');
    const newValidatorHash = await this.hashingPort.hash(newValidator);

    const expiresInString = this.environmentService.get(
      EnvEnum.JWT_REFRESH_EXPIRATION,
    );
    const expiresInMs = ms(expiresInString as StringValue);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const newTokenEntity = RefreshToken.create({
      id: this.uuidPort.generate(),
      userId: userId,
      selector: newSelector,
      validatorHash: newValidatorHash,
      expiresAt: expiresAt,
    });

    await this.refreshTokenRepo.save(newTokenEntity);

    return {
      accessToken: newAccessToken,
      refreshToken: `${newSelector}:${newValidator}`,
      user: {
        id: userId,
      },
    };
  }
}
