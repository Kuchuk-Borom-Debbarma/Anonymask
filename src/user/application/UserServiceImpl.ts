import UserService from '../api/service/UserService';
import UserDTO from '../api/dto/UserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../domain/User';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserAlreadyExists } from '../api/exceptions/exceptions';

@Injectable()
export default class UserServiceImpl extends UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super();
  }

  async createUser(
    userId: string,
    name: string,
    password: string,
  ): Promise<void> {
    console.log(`Create user with id ${userId}, name : ${name}`);
    //Check if user already exists
    const existingUser = await this.userRepo.findOne({
      where: { userId: userId },
    });
    //Throw exception if user already exists
    if (existingUser) {
      throw new UserAlreadyExists(userId);
    }
    //TODO Encrypt password
    await this.userRepo.save({
      userId: userId,
      username: name,
      passwordHashed: password,
    });
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

  private toDTO(user: User): UserDTO {
    return {
      username: user.username,
      userID: user.userId,
    };
  }
}
