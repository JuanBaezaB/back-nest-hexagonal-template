import { Injectable } from '@nestjs/common';
import { EnvEnum } from 'src/core/environment/enum/env.enum';
import { EnvironmentService } from 'src/core/environment/environment.service';
import { AuthConfigPort } from '../../application/ports/out/auth-config.port';

@Injectable()
export class AuthConfigAdapter implements AuthConfigPort {
  constructor(private readonly environmentService: EnvironmentService) {}

  getJwtRefreshExpiration(): string {
    return this.environmentService.get(EnvEnum.JWT_REFRESH_EXPIRATION);
  }
}
