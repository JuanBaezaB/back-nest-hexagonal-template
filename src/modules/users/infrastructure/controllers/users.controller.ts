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
import { UsersService } from '../../application/use-cases/users.service';
import { CreateUserDto } from '../../application/ports/in/create-user.dto';
import { UpdateUserDto } from '../../application/ports/in/update-user.dto';

// Este es el ADAPTADOR DE ENTRADA (HTTP)
@Controller('users')
export class UsersController {
  // El controlador depende del Use Case (UsersService)
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
