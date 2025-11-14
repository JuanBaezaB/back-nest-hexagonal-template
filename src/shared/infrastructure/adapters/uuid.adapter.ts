import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UuidPort } from '../../application/ports/out/uuid.port';

@Injectable()
export class UuidAdapter implements UuidPort {
  generate(): string {
    return randomUUID();
  }
}
