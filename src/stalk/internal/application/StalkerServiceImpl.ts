import { StalkService } from '../../api/Services';

export default class StalkerServiceImpl implements StalkService {
  stalk(stalkerId: string, stalkedId: string): Promise<boolean | null> {
    throw new Error('Method not implemented.');
  }

  stopStalking(stalkerId: string, stalkedId: string): Promise<boolean | null> {
    throw new Error('Method not implemented.');
  }

  isStalking(stalkerId: string, stalkedId: string): Promise<boolean | null> {
    throw new Error('Method not implemented.');
  }

  getStalkers(
    userId: string,
    pagination?: { skip: number; limit: number },
  ): Promise<{ stalkers?: string[]; count: number } | null> {
    throw new Error('Method not implemented.');
  }

  getStalking(
    userId: string,
    pagination?: { skip: number; limit: number },
  ): Promise<{ stalking?: string[]; count: number } | null> {
    throw new Error('Method not implemented.');
  }
}
