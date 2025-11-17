import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { LoginCommand } from '../../application/commands/impl/login.command';
import { RefreshTokenCommand } from '../../application/commands/impl/refresh-token.command';
import { RegisterUserCommand } from '../../application/commands/impl/register-user.command';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login.response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RefreshResponseDto } from '../dto/refresh.response.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterResponseDto } from '../dto/register.response.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // Aplicamos interceptor
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const result: LoginResponseDto = await this.commandBus.execute(
      new LoginCommand(loginDto),
    );
    return plainToInstance(LoginResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    const result: RegisterResponseDto = await this.commandBus.execute(
      new RegisterUserCommand(registerUserDto),
    );
    return plainToInstance(RegisterResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshResponseDto> {
    const result: RefreshResponseDto = await this.commandBus.execute(
      new RefreshTokenCommand(refreshTokenDto),
    );
    return plainToInstance(RefreshResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
