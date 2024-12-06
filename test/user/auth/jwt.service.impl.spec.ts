import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import JwtServiceImpl from 'src/user/auth/application/JwtServiceImpl';
import { BadRequestException } from '@nestjs/common';

describe('JwtServiceImpl', () => {
  let jwtServiceImpl: JwtServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      providers: [JwtServiceImpl],
    }).compile();

    jwtServiceImpl = module.get<JwtServiceImpl>(JwtServiceImpl);
  });

  describe('generateJwt', () => {
    it('should throw an error if the subject is missing', () => {
      const claims = new Map<string, string>([
        ['role', 'admin'],
        ['email', 'test@example.com'],
      ]);
      const subject = '';

      expect(() => jwtServiceImpl.generateJwt(claims, subject)).toThrow(BadRequestException);
      expect(() => jwtServiceImpl.generateJwt(claims, subject)).toThrow('Subject is required');
    });

    it('should throw an error if claims are empty', () => {
      const claims = new Map<string, string>();
      const subject = 'user123';

      expect(() => jwtServiceImpl.generateJwt(claims, subject)).toThrow(BadRequestException);
      expect(() => jwtServiceImpl.generateJwt(claims, subject)).toThrow('Claims cannot be empty');
    });

    it('should successfully generate a JWT with valid input', () => {
      const claims = new Map<string, string>([
        ['role', 'admin'],
        ['email', 'test@example.com'],
      ]);
      const subject = 'user123';

      const token = jwtServiceImpl.generateJwt(claims, subject);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifySignature', () => {
    it('should return decoded token if verification is successful', () => {
      const claims = new Map<string, string>([
        ['role', 'admin'],
        ['email', 'test@example.com'],
      ]);
      const subject = 'user123';
      
      const token = jwtServiceImpl.generateJwt(claims, subject);
  
      const decodedToken = {
        role: 'admin',
        email: 'test@example.com',
        exp: expect.any(Number),
        iat: expect.any(Number),
        sub: 'user123',
      };

      const result = jwtServiceImpl.verifySignature(token);
  
      expect(result).toEqual(decodedToken);
    });

    it('should throw an error if we use a random string to verify', () => {
      const claims = new Map<string, string>([
        ['role', 'admin'],
        ['email', 'test@example.com'],
      ]);
      const subject = 'user123';
      
      const token = jwtServiceImpl.generateJwt(claims, subject);
    
      const invalidToken = "agfsdgfdhvdbdvbgdfgfdgwsdrbwetefgsfdcsd";
    
      const result = jwtServiceImpl.verifySignature(invalidToken);
    
      expect(result).toEqual({
        error: 'Invalid token',
        details: expect.any(String),
      });
    });
  });
});
