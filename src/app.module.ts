import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CommonModule, SharedModule, UsersModule, TasksModule],
})
export class AppModule {}
