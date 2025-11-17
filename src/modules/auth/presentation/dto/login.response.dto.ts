import { Expose, Type } from 'class-transformer';
import { AuthUserResponseDto } from './auth-user.response.dto';

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  @Type(() => AuthUserResponseDto)
  user: AuthUserResponseDto;
}
