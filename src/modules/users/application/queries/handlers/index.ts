import { GetAllUsersHandler } from './get-all-users.handler';
import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { GetUserByIdHandler } from './get-user-by-id.handler';

export const QueryHandlers = [
  GetAllUsersHandler,
  GetUserByIdHandler,
  GetUserByEmailHandler,
];
