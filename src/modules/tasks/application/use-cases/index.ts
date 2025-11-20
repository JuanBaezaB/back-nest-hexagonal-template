import { CreateTaskUseCase } from './create-task.use-case';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { GetAllTasksUseCase } from './get-all-tasks.use-case';
import { GetTaskByIdUseCase } from './get-task-by-id.use-case';

export const TaskUseCases = [
  CreateTaskUseCase,
  GetAllTasksUseCase,
  GetTaskByIdUseCase,
  DeleteTaskUseCase,
];
