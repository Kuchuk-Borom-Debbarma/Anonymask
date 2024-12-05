import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './domain/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
