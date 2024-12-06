import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../src/user/domain/User';
import { Repository } from 'typeorm';
import UserServiceImpl from '../../src/user/application/UserServiceImpl';

describe('userServiceImpl', () => {
  let userService: UserServiceImpl;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //Using actual service
        UserServiceImpl,
        //Mocking repository
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();
    userService = module.get<UserServiceImpl>(UserServiceImpl);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create user', () => {
    it('should create a user since there is no existing user', async () => {
      //No existing user mock
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      //Mock save functionality
      jest.spyOn(userRepository, 'save').mockResolvedValue(null);

      await userService.createUser('test user', 'testName', 'random password');

      //Asset that userRepo.findOne was called with the parameter test user for userId
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: 'test user',
        },
      });
      //Assert that save was called with the parameters specified
      expect(userRepository.save).toHaveBeenCalledWith({
        userId: 'test user',
        username: 'testName',
        passwordHashed: 'random password',
      });
    });
  });

  describe('get user', () => {
    it('should return null as there is no existing user', async () => {
      //mock null as return value of findOne function
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const user = await userService.getUserById('testID');
      expect(user).toBeNull();
    });

    it('should return a user as there is an existing user', async () => {
      const testUser: User = {
        userId: 'test',
        username: 'test name',
        passwordHashed: 'dummy',
      };
      // @ts-ignore
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(testUser);
      const result = await userService.getUserById('test');
      expect(result).toBeDefined();
      expect(result.userID).toBe('test');
      expect(result.username).toBe('test name');
    });
  });
});
