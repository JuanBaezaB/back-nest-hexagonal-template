import { IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/application/ports/in/create-user.dto';

export class RegisterUserDto extends CreateUserDto {
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
