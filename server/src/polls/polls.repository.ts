import { Injectable, Logger, Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoRedisKey } from 'src/redis/redis.module';
import { Redis } from 'ioredis';
import { AddParticipantData, CreatePollData } from './types';
import { Poll } from 'shared';
@Injectable()
export class PollsRepository {
  // time to live 
  private til: string;
  private logger = new Logger(PollsRepository.name);
  public getKey = (pollId: string) => `polls:${pollId}`;

  constructor(
    private readonly configService: ConfigService,
    @Inject(IoRedisKey) private readonly redis: Redis,
  ) {
    this.til = configService.get('POLL_DURATION');
  }

  async createPoll({
    pollID, topic, userID, votesPerVoter
  }: CreatePollData): Promise<Poll> {
    const poll = {
      adminId: userID,
      topic,
      id: pollID,
      votesPerVoter,
      participants: {},
    };
    const key = this.getKey(pollID);

    this.logger.log(
      `Creating new poll: ${poll.topic} with TTL ${this.til
      }`,
    );
    try {
      // thanks ChatGPT !!
      await this.redis.set(key, JSON.stringify(poll), "EX", this.til)
      return poll

    } catch (error) {
      console.error(error)
      this.logger.error(`Failed to add poll ${JSON.stringify(poll)}\n${error}`)
    }
    throw new InternalServerErrorException()
  }

  async getPoll(pollID: string) {
    try {
      this.logger.log(`getting poll with id  ${pollID}`)
      const poll = await this.redis.get(this.getKey(pollID))
      this.logger.verbose(poll)
      return JSON.parse(poll) as Poll
    } catch (error) {
      this.logger.error(`Failed to get Pool with id ${pollID}`)
      throw new InternalServerErrorException("Redis Error ")

    }
  }
  async addParticipant({ name, pollID, userID }: AddParticipantData): Promise<Poll> {
    try {
      const poll = await this.getPoll(pollID) as Poll
      poll.participants[`${userID}`] = name
      await this.redis.set(this.getKey(pollID), JSON.stringify(poll))
      return poll
    } catch (error) {

    }


  }
}
