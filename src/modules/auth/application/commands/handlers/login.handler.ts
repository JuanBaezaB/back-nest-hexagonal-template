import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { LoginCommand } from '../impl/login.command';
import { UserRepositoryPort } from 'src/modules/users/application/ports/out/user.repository.port';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import type { StringValue } from 'ms';
import ms from 'ms';
import { TokenPort } from '../../ports/out/token.port';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { HashingPort } from 'src/shared/application/ports/out/hashing.port';
import { AuthConfigPort } from '../../ports/out/auth-config.port';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
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
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command.loginDto;

    const user = await this.userRepository.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch =
      user.password &&
      (await this.hashingPort.compare(password, user.password));

    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id };
    const accessToken = this.tokenPort.sign(payload);

    const selector = this.uuidPort.generate();
    const validator = randomBytes(32).toString('hex');
    const validatorHash = await this.hashingPort.hash(validator);

    const expiresInString = this.authConfigPort.getJwtRefreshExpiration();
    const expiresInMs = ms(expiresInString as StringValue);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const tokenEntity = RefreshToken.create({
      id: this.uuidPort.generate(),
      userId: user.id,
      selector: selector,
      validatorHash: validatorHash,
      expiresAt: expiresAt,
    });
    await this.refreshTokenRepo.save(tokenEntity);

    return {
      accessToken,
      refreshToken: `${selector}:${validator}`,
      user: { id: user.id },
    };
  }
}
