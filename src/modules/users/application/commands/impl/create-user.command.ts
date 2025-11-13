import { CreateUserDto } from '../../../application/ports/in/create-user.dto';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}
