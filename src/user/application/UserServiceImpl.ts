import UserService from '../api/service/UserService';
import UserDTO from '../api/dto/UserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../domain/User';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserAlreadyExistsException } from '../api/exceptions/exceptions';

@Injectable()
export default class UserServiceImpl extends UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super();
  }

  async createUser(
    userId: string,
    name: string,
    password: string,
  ): Promise<UserDTO> {
    console.log(`Create user with id ${userId}, name : ${name}`);
    //Check if user already exists
    const existingUser = await this.userRepo.findOne({
      where: { userId: userId },
    });
    //Throw exception if user already exists
    if (existingUser) {
      throw new UserAlreadyExistsException(userId);
    }
    //TODO Encrypt password
    const savedUser = await this.userRepo.save({
      userId: userId,
      username: name,
      passwordHashed: password,
    });
    return this.toDTO(savedUser);
  }

  async getUserById(userId: string): Promise<UserDTO | null> {
    console.log(`Getting user with id ${userId}`);
    const user = await this.userRepo.findOne({
      where: {
        userId: userId,
      },
    });
    return this.toDTO(user);
  }

  private toDTO(user: User): UserDTO | null {
    if (!user) return null;
    return {
      username: user.username,
      userID: user.userId,
    };
  }
}
