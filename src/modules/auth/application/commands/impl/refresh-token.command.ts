import { RefreshTokenPort } from '../../ports/in/refresh-token.port';

export class RefreshTokenCommand {
  constructor(public readonly refreshTokenDto: RefreshTokenPort) {}
}
