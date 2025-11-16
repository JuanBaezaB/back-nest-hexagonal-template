import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';
import type { StringValue } from 'ms';
import ms from 'ms';
import { HashingPort } from 'src/shared/application/ports/out/hashing.port';
import { UuidPort } from 'src/shared/application/ports/out/uuid.port';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { AuthConfigPort } from '../../ports/out/auth-config.port';
import { CredentialRepositoryPort } from '../../ports/out/credential.repository.port';
import { TokenPort } from '../../ports/out/token.port';
import { LoginCommand } from '../impl/login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(RefreshTokenRepositoryPort)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
    @Inject(CredentialRepositoryPort)
    private readonly credentialRepository: CredentialRepositoryPort,
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

    const credential = await this.credentialRepository.findOneByEmail(email);

    if (!credential) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await this.hashingPort.compare(
      password,
      credential.passwordHash,
    );

    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: credential.id };
    const accessToken = this.tokenPort.sign(payload);

    const selector = this.uuidPort.generate();
    const validator = randomBytes(32).toString('hex');
    const validatorHash = await this.hashingPort.hash(validator);

    const expiresInString = this.authConfigPort.getJwtRefreshExpiration();
    const expiresInMs = ms(expiresInString as StringValue);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const tokenEntity = RefreshToken.create({
      id: this.uuidPort.generate(),
      userId: credential.id,
      selector: selector,
      validatorHash: validatorHash,
      expiresAt: expiresAt,
    });
    await this.refreshTokenRepo.save(tokenEntity);

    return {
      accessToken,
      refreshToken: `${selector}:${validator}`,
      user: { id: credential.id },
    };
  }
}
