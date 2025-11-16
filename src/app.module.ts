import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, SharedModule, UsersModule, AuthModule],
})
export class AppModule {}
