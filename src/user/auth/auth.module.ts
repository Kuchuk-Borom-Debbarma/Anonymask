import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import JwtServiceImpl from './application/JwtServiceImpl';
import JwtService from './api/service/JwtService';
import GoogleAuthService from './api/service/AuthService';
import GoogleAuthServiceImpl from './application/GoogleAuthServiceImpl';

@Module({
  imports: [
    ConfigModule.forRoot(),  
    JwtModule.registerAsync({
      global: true,  
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: JwtService,
      useClass: JwtServiceImpl,
    },
    {
      provide: GoogleAuthService,
      useClass: GoogleAuthServiceImpl,  
    },
  ],
  exports: [JwtService, GoogleAuthService],
})
export class AuthModule {}
