import { LoginPort } from '../../ports/in/login.port';

export class LoginCommand {
  constructor(public readonly loginPort: LoginPort) {}
}
