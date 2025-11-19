import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { Transactional } from '../../../../shared/application/decorators/transactional.decorator';
import { CreateUserCommand } from '../../application/commands/impl/create-user.command';
import { DeleteUserCommand } from '../../application/commands/impl/delete-user.command';
import { UpdateUserCommand } from '../../application/commands/impl/update-user.command';
import { GetAllUsersQuery } from '../../application/queries/impl/get-all-users.query';
import { GetUserByIdQuery } from '../../application/queries/impl/get-user-by-id.query';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Transactional()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user: User = await this.commandBus.execute(
      new CreateUserCommand(createUserDto),
    );
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users: User[] = await this.queryBus.execute(new GetAllUsersQuery());
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user: User = await this.queryBus.execute(new GetUserByIdQuery(id));
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @Transactional()
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user: User = await this.commandBus.execute(
      new UpdateUserCommand(id, updateUserDto),
    );
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @Transactional()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
