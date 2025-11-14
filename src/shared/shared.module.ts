// src/shared/shared.module.ts

import { Global, Module } from '@nestjs/common';
import { UuidPort } from './application/ports/out/uuid.port';
import { UuidAdapter } from './infrastructure/adapters/uuid.adapter';
import { HashingPort } from './application/ports/out/hashing.port';
import { HashingAdapter } from './infrastructure/adapters/hashing.adapter';

const UuidProvider = {
  provide: UuidPort,
  useClass: UuidAdapter,
};

const HashingProvider = {
  provide: HashingPort,
  useClass: HashingAdapter,
};

@Global()
@Module({
  providers: [UuidProvider, HashingProvider],
  exports: [UuidProvider, HashingProvider],
})
export class SharedModule {}
