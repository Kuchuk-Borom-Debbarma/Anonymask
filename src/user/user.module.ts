import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './domain/User';
import UserService from './api/service/UserService';
import UserServiceImpl from './application/UserServiceImpl';
import UserField from './domain/UserField';
import UserFieldMap from './domain/UserFieldMap';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserField, UserFieldMap]),
    AuthModule,
  ],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
  ],
  exports: [UserService, AuthModule],
})
export class UserModule {}
