import { UpdateUserPort } from '../../ports/in/update-user.port';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly updateUserPort: UpdateUserPort,
  ) {}
}
