import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepositoryPort } from '../../../application/ports/out/refresh-token.repository.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { LoginCommand } from '../impl/login.command';
import { UserRepositoryPort } from 'src/modules/users/application/ports/out/user.repository.port';
import { HashingService } from 'src/core/services/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { randomUUID, randomBytes } from 'crypto';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(RefreshTokenRepositoryPort)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
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

    const refreshToken = randomBytes(32).toString('hex');
    const refreshTokenHash = await this.hashingService.hash(refreshToken);

    const tokenEntity = new RefreshToken({
      id: randomUUID(),
      userId: user.id,
      tokenHash: refreshTokenHash,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });
    await this.refreshTokenRepo.save(tokenEntity);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id },
    };
  }
}
