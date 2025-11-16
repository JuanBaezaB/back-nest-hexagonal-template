import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvEnum } from './enum/env.enum';
import { Environment } from './types/environment.type';

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly configService: ConfigService<Environment, true>,
  ) {}

  get<Key extends keyof Environment>(key: Key): Environment[Key] {
    return this.configService.getOrThrow(key);
  }

  isProd(): boolean {
    return this.get(EnvEnum.ENVIRONMENT) === 'production';
  }

  isDev(): boolean {
    return this.get(EnvEnum.ENVIRONMENT) === 'development';
  }
}
