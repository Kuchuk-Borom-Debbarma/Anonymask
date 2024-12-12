import { StalkService } from './api/Services';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import UserServiceImpl from '../user/application/UserServiceImpl';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstEnvNames } from '../util/Constants';
import { StalkCounterEntity, StalkEntity } from './internal/domain/Entities';

describe('Stalk Integration Test', () => {
  let service: StalkService;
  let db: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'postgres',
              host: configService.get<string>(ConstEnvNames.DB_HOST),
              username: configService.get<string>(ConstEnvNames.DB_USERNAME),
              password: configService.get<string>(ConstEnvNames.DB_PWD),
              database: configService.get<string>(ConstEnvNames.DB_NAME),
              ssl: {
                rejectUnauthorized: false,
              },
              autoLoadEntities: true,
            };
          },
        }),
      ],
      providers: [UserServiceImpl],
    }).compile();

    service = module.get(UserServiceImpl);
    db = module.get(DataSource);
  });

  beforeEach(async () => {
    await db.getRepository(StalkEntity).clear();
    await db.getRepository(StalkCounterEntity).clear();
  });

  afterAll(async () => {
    await db.destroy();
  });

  const user1 :

  it('Should Start stalking', () => {
    expect(true).toBe(true);
  });
});
