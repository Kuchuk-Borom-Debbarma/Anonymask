import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    CommonModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_URL,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log(JSON.stringify(process.env));
  }
}
