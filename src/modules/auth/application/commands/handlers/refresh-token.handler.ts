import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from 'src/core/services/hashing.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';
import { JwtPayload } from '../../types/jwt-payload.type';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject(RefreshTokenRepositoryPort)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { refreshToken, accessToken } = command.refreshTokenDto;

    const { sub: userId }: JwtPayload = this.jwtService.decode(accessToken);

    const storedTokens =
      await this.refreshTokenRepo.findActiveTokensByUserId(userId);

    let matchedToken: RefreshToken | null = null;

    for (const token of storedTokens) {
      const isMatch = await this.hashingService.compare(
        refreshToken,
        token.tokenHash,
      );
      if (isMatch) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken || matchedToken.isExpired()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    await this.refreshTokenRepo.update(matchedToken.id, { isRevoked: true });

    const newAccessToken = this.jwtService.sign({ sub: userId });

    const newRefreshTokenPlain = randomBytes(32).toString('hex');
    const newHash = await this.hashingService.hash(newRefreshTokenPlain);

    const newTokenEntity = new RefreshToken({
      id: randomUUID(),
      userId: userId,
      tokenHash: newHash,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });

    await this.refreshTokenRepo.save(newTokenEntity);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenPlain,
      user: {
        id: userId,
      },
    };
  }
}
