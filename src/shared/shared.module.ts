// src/shared/shared.module.ts

import { Global, Module } from '@nestjs/common';
import { HashingPort } from './application/ports/out/hashing.port';
import { UnitOfWorkPort } from './application/ports/out/unit-of-work.port';
import { UuidPort } from './application/ports/out/uuid.port';
import { HashingAdapter } from './infrastructure/adapters/hashing.adapter';
import { MikroOrmUnitOfWorkAdapter } from './infrastructure/adapters/mikroorm-unit-of-work.adapter';
import { UuidAdapter } from './infrastructure/adapters/uuid.adapter';

const UuidProvider = {
  provide: UuidPort,
  useClass: UuidAdapter,
};

const HashingProvider = {
  provide: HashingPort,
  useClass: HashingAdapter,
};

const UnitOfWorkProvider = {
  provide: UnitOfWorkPort,
  useClass: MikroOrmUnitOfWorkAdapter,
};

@Global()
@Module({
  providers: [UuidProvider, HashingProvider, UnitOfWorkProvider],
  exports: [UuidProvider, HashingProvider, UnitOfWorkProvider],
})
export class SharedModule {}
