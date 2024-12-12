import { StalkService } from '../../src/stalk/api/Services';
import { DataSource, Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstEnvNames } from '../../src/util/Constants';
import {
  StalkCounterEntity,
  StalkEntity,
} from '../../src/stalk/internal/domain/Entities';
import StalkServiceImpl from '../../src/stalk/internal/application/StalkServiceImpl';

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
              entities: [StalkEntity, StalkCounterEntity],
            };
          },
        }),
        TypeOrmModule.forFeature([StalkEntity, StalkCounterEntity]),
      ],
      providers: [StalkServiceImpl],
    }).compile();

    service = module.get(StalkServiceImpl);
    db = module.get(DataSource);
  });
  let stalkRepo: Repository<StalkEntity>;
  let countRepo: Repository<StalkCounterEntity>;

  beforeEach(async () => {
    stalkRepo = db.getRepository(StalkEntity);
    countRepo = db.getRepository(StalkCounterEntity);
  });

  afterEach(async () => {
    await stalkRepo.delete({ stalker: 'user1' });
    await stalkRepo.delete({ stalker: 'user2' });
    await stalkRepo.delete({ stalker: 'user3' });
    await stalkRepo.delete({ stalker: 'user4' });
    await stalkRepo.delete({ stalker: 'user5' });
    await countRepo.delete({ userId: 'user1' });
    await countRepo.delete({ userId: 'user2' });
    await countRepo.delete({ userId: 'user3' });
    await countRepo.delete({ userId: 'user4' });
    await countRepo.delete({ userId: 'user5' });
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('Should Start stalking', async () => {
    const result = await service.stalk('user1', 'user2');
    expect(result).toBe(true);
    const found = await stalkRepo.findOneBy({
      stalker: 'user1',
      stalked: 'user2',
    });
    expect(found).toBeDefined();
    const user1 = await countRepo.findOne({
      where: {
        userId: 'user1',
      },
    });
    expect(user1).toBeDefined();
    expect(user1.stalkingCount).toBe('1');
    const user2 = await countRepo.findOne({
      where: {
        userId: 'user2',
      },
    });
    expect(user2).toBeDefined();
    expect(user2.stalkerCount).toBe('1');
  });

  it('Should fail stalking as already stalking', async () => {
    await stalkRepo.save({
      stalker: 'user1',
      stalked: 'user2',
      at: new Date(),
    });

    const existingCount = await countRepo.findOneBy({ userId: 'user1' });
    expect(existingCount).toBeNull();

    const result = await service.stalk('user1', 'user2');
    expect(result).toBe(false);
    expect(await countRepo.findOneBy({ userId: 'user1' })).toBeNull();
  });

  it('Is Stalking should return false', async () => {
    const result = await service.isStalking('user1', 'user2');
    expect(result).toBe(false);
  });
  it('is stalking should return true', async () => {
    await service.stalk('user1', 'user2');
    const result = await service.isStalking('user1', 'user2');
    expect(result).toBe(true);
  });

  it('Should stop stalking', async () => {
    const stalkResult = await service.stalk('user1', 'user2');
    expect(stalkResult).toBe(true);
    const stopResult = await service.stopStalking('user1', 'user2');
    expect(stopResult).toBe(true);
    const user1Count = await countRepo.findOneBy({ userId: 'user1' });
    expect(user1Count).toBeDefined();
    expect(user1Count.stalkingCount).toBe('0');
    const user2Count = await countRepo.findOneBy({ userId: 'user2' });
    expect(user2Count).toBeDefined();
    expect(user2Count.stalkerCount).toBe('0');
  });

  it("Can't stop stalking", async () => {
    const result = await service.stopStalking('user1', 'user2');
    expect(result).toBe(false);
  });

  it('Should get stalkers', async () => {
    await service.stalk('user1', 'user2');
    await service.stalk('user3', 'user2');

    let result = await service.getStalkers('user2');
    expect(result).toBeDefined();
    expect(result.stalkers).toBeUndefined();
    expect(result.count).toBe('2');

    result = await service.getStalkers('user2', { skip: 0, limit: 2 });
    expect(result).toBeDefined();
    expect(result.stalkers).toBeDefined();
    expect(result.stalkers.includes('user1')).toBe(true);
    expect(result.stalkers.includes('user3')).toBe(true);
    expect(result.count).toBe(2);

    result = await service.getStalkers('user2', { skip: 0, limit: 1 });
    expect(result).toBeDefined();
    expect(result.stalkers).toBeDefined();
    expect(result.stalkers.includes('user1')).toBe(true);
    expect(result.stalkers.includes('user3')).toBe(false);
    expect(result.count).toBe(2);
  });

  it('Should get stalking', async () => {
    await service.stalk('user1', 'user2');
    await service.stalk('user1', 'user3');

    let result = await service.getStalking('user1', { limit: 2, skip: 0 });
    expect(result).toBeDefined();
    expect(result.count).toBe(2);
    expect(result.stalking).toBeDefined();
    expect(result.stalking.includes('user2')).toBe(true);
    expect(result.stalking.includes('user3')).toBe(true);
  });

  it('Should get stalk counts', async () => {
    await service.stalk('user1', 'user2');
    await service.stalk('user1', 'user3');
    await service.stalk('user2', 'user3');

    const user1 = await service.getStalkCounts('user1');
    expect(user1.stalkerCount).toBe('0');
    expect(user1.stalkingCount).toBe('2');

    const user2 = await service.getStalkCounts('user2');
    expect(user2.stalkerCount).toBe('1');
    expect(user2.stalkingCount).toBe('1');

    const user3 = await service.getStalkCounts('user3');
    expect(user3.stalkerCount).toBe('2');
    expect(user3.stalkingCount).toBe('0');
  });
});
