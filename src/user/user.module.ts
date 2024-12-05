import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './domain/User';
import UserService from './api/service/UserService';
import UserServiceImpl from './application/UserServiceImpl';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
