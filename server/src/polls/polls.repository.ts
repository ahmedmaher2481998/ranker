import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoRedisKey } from 'src/redis/redis.module';
import { Redis } from 'ioredis';
import { CreatePollData } from './types';
import { Poll } from 'shared';
@Injectable()
export class PollsRepository {
  private til: string;
  private logger = new Logger(PollsRepository.name);
  public getKey = (pollId: string) => `polls:${pollId}`;

  constructor(
    private readonly configService: ConfigService,
    @Inject(IoRedisKey) private readonly redis: Redis,
  ) {
    this.til = configService.get('POLL_DURATION');
  }

  createPoll({
    pollId,
    topic,
    userId,
    votesPerVoter,
  }: CreatePollData): Promise<Poll> {
    const poll = {
      adminId: userId,
      topic,
      id: pollId,
      votesPerVoter,
      participants: {},
    };
    const key = this.getKey(pollId);

    this.logger.log(
      `Creating new poll: ${JSON.stringify(poll, null, 2)} with TTL ${
        this.til
      }`,
    );

    this.redis
      .multi([
        ['send_command', 'JSON.SET', key, '.', JSON.stringify(poll)],
        [''],
      ])
      .exec();
  }
}
