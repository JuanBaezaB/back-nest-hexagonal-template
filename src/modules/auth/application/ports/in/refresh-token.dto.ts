import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
