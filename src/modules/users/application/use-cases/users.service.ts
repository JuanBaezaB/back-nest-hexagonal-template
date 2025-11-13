import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from '../ports/out/user.repository.port';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../ports/in/create-user.dto';
import { UpdateUserDto } from '../ports/in/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const uuid = randomUUID();
    const newUser = new User({
      id: uuid,
      ...createUserDto,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
