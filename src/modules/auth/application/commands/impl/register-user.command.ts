import { RegisterUserPort } from '../../ports/in/register-user.port';

export class RegisterUserCommand {
  constructor(public readonly registerUserPort: RegisterUserPort) {}
}
