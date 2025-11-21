import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'src/shared/application/decorators/transactional.decorator';
import { ConnectionName } from 'src/shared/domain/enums/connection-name.enum';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { GetAllTasksUseCase } from '../../application/use-cases/get-all-tasks.use-case';
import { GetTaskByIdUseCase } from '../../application/use-cases/get-task-by-id.use-case';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskResponseDto } from '../dtos/task.response.dto';

@Controller('tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getAllTasksUseCase: GetAllTasksUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Post()
  @Transactional(ConnectionName.TASKS)
  async createTask(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    const user = await this.createTaskUseCase.execute(dto);
    return plainToInstance(TaskResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async getAllTasks(): Promise<TaskResponseDto[]> {
    const users = await this.getAllTasksUseCase.execute();
    return plainToInstance(TaskResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TaskResponseDto> {
    const user = await this.getTaskByIdUseCase.execute(id);
    return plainToInstance(TaskResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @Transactional(ConnectionName.TASKS)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteTaskUseCase.execute(id);
  }
}
