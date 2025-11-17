import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../../application/commands/impl/delete-user.command';
import { GetAllUsersQuery } from '../../application/queries/impl/get-all-users.query';
import { GetUserByIdQuery } from '../../application/queries/impl/get-user-by-id.query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // @Post()
  // createUser(@Body() createUserDto: CreateUserPort) {
  //   return this.commandBus.execute(new CreateUserCommand(createUserDto));
  // }

  @Get()
  getAllUsers() {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  // @Patch(':id')
  // updateUser(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateUserDto: UpdateUserPort,
  // ) {
  //   return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  // }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
