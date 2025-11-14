import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from 'src/core/services/hashing.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';
import { EnvironmentService } from 'src/core/environment/environment.service';
import { EnvEnum } from 'src/core/environment/enum/env.enum';
import type { StringValue } from 'ms';
import ms from 'ms';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject(RefreshTokenRepositoryPort)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
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

    const isMatch = await this.hashingService.compare(
      validator,
      storedToken.validatorHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const userId = storedToken.userId;

    await this.refreshTokenRepo.update(storedToken.id, { isRevoked: true });

    const newAccessToken = this.jwtService.sign({ sub: userId });

    const newSelector = randomUUID();
    const newValidator = randomBytes(32).toString('hex');
    const newValidatorHash = await this.hashingService.hash(newValidator);

    const expiresInString = this.environmentService.get(
      EnvEnum.JWT_REFRESH_EXPIRATION,
    );
    const expiresInMs = ms(expiresInString as StringValue);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const newTokenEntity = new RefreshToken({
      id: randomUUID(),
      userId: userId,
      selector: newSelector,
      validatorHash: newValidatorHash,
      isRevoked: false,
      expiresAt: expiresAt,
      createdAt: new Date(),
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
