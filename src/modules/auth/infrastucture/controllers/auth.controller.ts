import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../../application/commands/impl/login.command';
import { LoginDto } from '../../application/ports/in/login.dto';
import { RefreshTokenDto } from '../../application/ports/in/refresh-token.dto';
import { RefreshTokenCommand } from '../../application/commands/impl/refresh-token.command';
import { RegisterUserDto } from '../../application/ports/in/register-user.dto';
import { RegisterUserCommand } from '../../application/commands/impl/register-user.command';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.commandBus.execute(new LoginCommand(loginDto));
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(registerUserDto));
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(refreshTokenDto));
  }
}
