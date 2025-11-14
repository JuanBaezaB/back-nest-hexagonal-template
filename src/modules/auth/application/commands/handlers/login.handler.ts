import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { LoginCommand } from '../impl/login.command';
import { UserRepositoryPort } from 'src/modules/users/application/ports/out/user.repository.port';
import { HashingService } from 'src/core/services/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { randomUUID, randomBytes } from 'crypto'; // <-- Asegúrate que ambos estén
import { EnvironmentService } from 'src/core/environment/environment.service';
import { EnvEnum } from 'src/core/environment/enum/env.enum';
import type { StringValue } from 'ms';
import ms from 'ms';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(RefreshTokenRepositoryPort)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command.loginDto;

    const user = await this.userRepository.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch =
      user.password &&
      (await this.hashingService.compare(password, user.password));

    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const selector = randomUUID();
    const validator = randomBytes(32).toString('hex');
    const validatorHash = await this.hashingService.hash(validator);

    const expiresInString = this.environmentService.get(
      EnvEnum.JWT_REFRESH_EXPIRATION,
    );
    const expiresInMs = ms(expiresInString as StringValue);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const tokenEntity = RefreshToken.create({
      userId: user.id,
      selector: selector,
      validatorHash: validatorHash,
      expiresAt: expiresAt,
    });
    await this.refreshTokenRepo.save(tokenEntity);

    return {
      accessToken,
      refreshToken: `${selector}:${validator}`, // <-- Enviamos 'selector:validator'
      user: { id: user.id },
    };
  }
}
