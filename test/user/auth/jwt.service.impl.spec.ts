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

  it('should successfully generate a JWT with no input', () => {
    const token = jwtServiceImpl.generateJwt();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    console.log('Generated Token (No Input):', token); // Print token for inspection

    // Decode the token and check the "iat" claim
    const decoded = jwtServiceImpl.verifySignature(token);
    expect(decoded.iat).toBeDefined();
    expect(typeof decoded.iat).toBe('number'); // "iat" should be a number
  });

  it('should successfully generate a JWT with claims', () => {
    const claims = new Map([
      ['role', 'admin'],
      ['email', 'user@example.com'],
    ]);
    const token = jwtServiceImpl.generateJwt(claims);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    console.log('Generated Token (With Claims):', token); // Print token for inspection

    // Decode the token and check the claims
    const decoded = jwtServiceImpl.verifySignature(token);
    expect(decoded.role).toBe('admin');
    expect(decoded.email).toBe('user@example.com');
  });

  it('should successfully generate a JWT with subject', () => {
    const subject = 'user123';
    const token = jwtServiceImpl.generateJwt(undefined, subject);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    console.log('Generated Token (With Subject):', token); // Print token for inspection

    // Decode the token and check the subject
    const decoded = jwtServiceImpl.verifySignature(token);
    expect(decoded.sub).toBe(subject);
  });

  it('should successfully generate a JWT with claims and subject', () => {
    const claims = new Map([
      ['role', 'admin'],
      ['email', 'user@example.com'],
    ]);
    const subject = 'user123';
    const token = jwtServiceImpl.generateJwt(claims, subject);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    console.log('Generated Token (With Claims and Subject):', token); // Print token for inspection

    // Decode the token and check the claims and subject
    const decoded = jwtServiceImpl.verifySignature(token);
    expect(decoded.role).toBe('admin');
    expect(decoded.email).toBe('user@example.com');
    expect(decoded.sub).toBe(subject);
  });
});
