import { LoginDto } from '../../ports/in/login.dto';

export class LoginCommand {
  constructor(public readonly loginDto: LoginDto) {}
}
