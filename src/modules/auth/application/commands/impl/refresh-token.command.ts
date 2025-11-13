import { RefreshTokenDto } from '../../ports/in/refresh-token.dto';

export class RefreshTokenCommand {
  constructor(public readonly refreshTokenDto: RefreshTokenDto) {}
}
