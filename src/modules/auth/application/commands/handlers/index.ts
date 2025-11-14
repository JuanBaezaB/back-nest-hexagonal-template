import { LoginHandler } from './login.handler';
import { RefreshTokenHandler } from './refresh-token.handler';
import { RegisterUserHandler } from './register-user.handler';

export const CommandHandlers = [
  LoginHandler,
  RefreshTokenHandler,
  RegisterUserHandler,
];
