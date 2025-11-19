import { CreateUserUseCase } from './create-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { GetAllUsersUseCase } from './get-all-users.use-case';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { UpdateUserUseCase } from './update-user.use-case';

export const UserUseCases = [
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
];
