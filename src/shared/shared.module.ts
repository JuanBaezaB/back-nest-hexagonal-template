// src/shared/shared.module.ts

import { Global, Module } from '@nestjs/common';
import { UuidPort } from './application/ports/out/uuid.port';
import { UuidAdapter } from './infrastructure/adapters/uuid.adapter';

const UuidProvider = {
  provide: UuidPort,
  useClass: UuidAdapter,
};

@Global()
@Module({
  providers: [UuidProvider],
  exports: [UuidProvider],
})
export class SharedModule {}
