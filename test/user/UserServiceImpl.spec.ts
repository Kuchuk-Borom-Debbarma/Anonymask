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
});
