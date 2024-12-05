import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

const dummy = {
  type: 'postgres',
  host: process.env.DATABASE_URL,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

console.log(JSON.stringify(dummy));
bootstrap();
