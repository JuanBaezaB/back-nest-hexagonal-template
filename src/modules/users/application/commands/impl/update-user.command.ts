import { UpdateUserDto } from '../../../application/ports/in/update-user.dto';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly updateUserDto: UpdateUserDto,
  ) {}
}
