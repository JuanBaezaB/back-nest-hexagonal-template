import { CreateUserPort } from '../../../application/ports/in/create-user.port';

export class CreateUserCommand {
  constructor(public readonly createUserPort: CreateUserPort) {}
}
