import { StalkService } from '../../api/Services';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stalk, StalkCounter } from '../domain/Entities';
import { InjectRepository } from '@nestjs/typeorm';

export default class StalkerServiceImpl implements StalkService {
  constructor(
    @InjectRepository(Stalk) private stalkRepo: Repository<Stalk>,
    @InjectRepository(StalkCounter)
    private stalkCountRepo: Repository<StalkCounter>,
  ) {}

  private log = new Logger(StalkerServiceImpl.name);

  async stalk(stalkerId: string, stalkedId: string): Promise<boolean | null> {
    try {
      this.log.debug(`User ${stalkerId} attempting to stalk ${stalkedId}`);
      //Check if already stalking
      const isStalking = await this.isStalking(stalkerId, stalkedId);
      if (isStalking) {
        this.log.warn(`User ${stalkerId} is already stalking ${stalkedId}`);
        return false;
      }
      //Add stalker and stalking
      await this.stalkRepo.save({
        stalker: stalkerId,
        stalked: stalkedId,
      });
      //TODO Convert this into an event
      await this.updateStalkCount(stalkerId, 'STALKING', 'INCREMENT');
      await this.updateStalkCount(stalkerId, 'STALKER', 'INCREMENT');
      return true;
    } catch (err) {
      this.log.error(`Error at stalk ${err}`);
      return null;
    }
  }

  async stopStalking(
    stalkerId: string,
    stalkedId: string,
  ): Promise<boolean | null> {
    try {
      this.log.debug(
        `User ${stalkerId} attempting to stop stalking ${stalkedId}`,
      );
      //Check if stalking
      const isStalking = await this.isStalking(stalkerId, stalkedId);
      if (!isStalking) {
        this.log.warn(
          `Cant Stop stalking. ${stalkerId} is not stalking ${stalkedId}.`,
        );
        return false;
      }
      const result = await this.stalkRepo.delete({
        stalker: stalkerId,
        stalked: stalkedId,
      });
      const deleted = result.affected != undefined && result.affected == 1;
      if (!deleted) return false;
      //TODO publish event
      await this.updateStalkCount(stalkerId, 'STALKING', 'DECREMENT');
      await this.updateStalkCount(stalkedId, 'STALKER', 'DECREMENT');
    } catch (err) {
      this.log.error(`Error at stop talking ${err}`);
      return null;
    }
  }

  async isStalking(
    stalkerId: string,
    stalkedId: string,
  ): Promise<boolean | null> {
    this.log.debug(`Checking if ${stalkerId} is stalking ${stalkedId}`);
    const found = await this.stalkRepo.findOne({
      where: {
        stalker: stalkerId,
        stalked: stalkedId,
      },
    });
    return found !== null;
  }

  async getStalkers(
    userId: string,
    pagination?: { skip: number; limit: number },
  ): Promise<{ stalkers?: string[]; count: number } | null> {
    if (pagination) {
      this.log.debug(`Getting both stalkers list and count of ${userId}`);
      const result = await this.stalkRepo.findAndCount({
        skip: pagination.skip,
        take: pagination.limit,
        where: {
          stalked: userId,
        },
      });
      return {
        stalkers: result[0].map((value) => value.stalker),
        count: result[1],
      };
    }
    this.log.debug(`Only getting stalker counts of ${userId}`);
    const result = await this.stalkCountRepo.findOneBy({ userId: userId });
    return {
      count: result.stalkerCount,
    };
  }

  async getStalking(
    userId: string,
    pagination?: { skip: number; limit: number },
  ): Promise<{ stalking?: string[]; count: number } | null> {
    if (pagination) {
      this.log.debug(`Getting stalking and its counts of user ${userId}`);
      const result = await this.stalkRepo.findAndCount({
        where: {
          stalker: userId,
        },
        skip: pagination.skip,
        take: pagination.limit,
      });
      return {
        stalking: result[0].map((value) => value.stalked),
        count: result[1],
      };
    }
    this.log.debug(`Getting ONLY stalking count of user ${userId}`);
    const result = await this.stalkCountRepo.findOneBy({ userId: userId });
    return {
      count: result.stalkingCount,
    };
  }

  async getStalkCounts(
    userId: string,
  ): Promise<{ stalking: number; stalker: number }> {
    this.log.debug(`Getting stalk counts of user ${userId}`);
    const result = await this.stalkCountRepo.findOneBy({ userId: userId });
    return {
      stalker: result.stalkerCount,
      stalking: result.stalkingCount,
    };
  }

  private async updateStalkCount(
    userId: string,
    increment: 'STALKING' | 'STALKER',
    action: 'INCREMENT' | 'DECREMENT',
  ) {
    this.log.debug(`Incrementing stalker count of user ${userId}`);

    // Check if an existing record exists
    const existingCount = await this.stalkCountRepo.findOneBy({
      userId: userId,
    });

    if (!existingCount) {
      this.log.warn(
        `Existing stalk count entry not found for user ${userId}. Creating new entry`,
      );
      await this.stalkCountRepo.save({
        stalkerCount: 0,
        stalkingCount: 0,
        userId: userId,
      });
    }
    if (increment == 'STALKER') {
      // Correctly update the record using a filter and updated data
      await this.stalkCountRepo.update(
        { userId: userId }, // Filter to find the record
        {
          stalkerCount:
            action == 'INCREMENT'
              ? existingCount.stalkerCount + 1
              : existingCount.stalkerCount - 1,
        }, // Data to update
      );
    } else if (increment == 'STALKING') {
      // Correctly update the record using a filter and updated data
      await this.stalkCountRepo.update(
        { userId: userId }, // Filter to find the record
        {
          stalkingCount:
            action == 'INCREMENT'
              ? existingCount.stalkingCount + 1
              : existingCount.stalkingCount - 1,
        }, // Data to update
      );
    }
  }
}
