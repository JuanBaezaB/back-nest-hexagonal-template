import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../../application/ports/in/create-user.dto';
import { UpdateUserDto } from '../../application/ports/in/update-user.dto';
import { CreateUserCommand } from '../../application/commands/impl/create-user.command';
import { UpdateUserCommand } from '../../application/commands/impl/update-user.command';
import { DeleteUserCommand } from '../../application/commands/impl/delete-user.command';
import { GetAllUsersQuery } from '../../application/queries/impl/get-all-users.query';
import { GetUserByIdQuery } from '../../application/queries/impl/get-user-by-id.query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  getAllUsers() {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
