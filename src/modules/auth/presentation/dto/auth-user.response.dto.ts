import { Expose } from 'class-transformer';

export class AuthUserResponseDto {
  @Expose()
  id: string;
}
