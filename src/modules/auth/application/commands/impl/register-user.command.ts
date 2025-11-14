import { RegisterUserDto } from '../../ports/in/register-user.dto';

export class RegisterUserCommand {
  constructor(public readonly registerUserDto: RegisterUserDto) {}
}
