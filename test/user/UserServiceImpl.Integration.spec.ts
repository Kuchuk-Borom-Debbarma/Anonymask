import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from '../../src/user/domain/User';
import UserServiceImpl from '../../src/user/application/UserServiceImpl';
import { UserAlreadyExistsException } from '../../src/user/api/exceptions/exceptions';

describe('UserServiceImpl Integration', () => {
  let userService: UserServiceImpl;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test.local', // Separate test environment configuration
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PWD'),
              database: configService.get<string>('DB_NAME'),
              ssl: {
                rejectUnauthorized: false,
              },
              entities: [User],
            };
          },
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserServiceImpl],
    }).compile();

    userService = module.get<UserServiceImpl>(UserServiceImpl);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Clear the users table before each test
    await dataSource.getRepository(User).clear();
  });

  describe('create user', () => {
    it('should create a user since there is no existing user', async () => {
      const userId = 'test-user-id';
      const username = 'testName';
      const password = 'random password';

      const createdUser = await userService.createUser(
        userId,
        username,
        password,
      );

      // Validate the created user
      expect(createdUser).toBeDefined();
      expect(createdUser.userID).toBe(userId);
      expect(createdUser.username).toBe(username);

      // verify in the database
      const userRepository = dataSource.getRepository(User);
      const savedUser = await userRepository.findOne({
        where: { userId: userId },
      });

      expect(savedUser).toBeTruthy();
      expect(savedUser.userId).toBe(userId);
      expect(savedUser.username).toBe(username);
    });
  });

  it('should throw UserAlreadyExistsException since there is a user', async () => {
    const userId = 'test-user-id';
    const username = 'testName';
    const password = 'random password';

    // First, create the initial user
    const createdUser = await userService.createUser(
      userId,
      username,
      password,
    );

    // verify in the database
    const userRepository = dataSource.getRepository(User);
    const savedUser = await userRepository.findOne({
      where: { userId: userId },
    });

    expect(savedUser).toBeTruthy();
    expect(savedUser.userId).toBe(userId);
    expect(savedUser.username).toBe(username);

    // This should throw exception
    // Use await with expect().rejects.toThrow()
    await expect(
      userService.createUser(userId, username, password),
    ).rejects.toThrow(UserAlreadyExistsException);
  });
});
