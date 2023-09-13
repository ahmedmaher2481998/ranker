import { Injectable } from '@nestjs/common';
import { createPollFields, joinPollFields, rejoinPollFields } from './types';
import { generateUserId, generatePollId } from 'src//ids';
import { PollsRepository } from './polls.repository';
@Injectable()
export class PollsService {
  constructor(
    private readonly PoolsRepo: PollsRepository
  ) { }
  async create({ name, topic, votesPerVoter }: createPollFields) {
    const pollID = generatePollId();
    const userID = generateUserId();
    await this.PoolsRepo.createPoll({
      pollID, userID, topic, votesPerVoter
    })
    const pool = await this.PoolsRepo.getPoll(pollID)
    return pool
  }

  async join({
    name, pollID
  }: joinPollFields) {
    const userID = generateUserId()
    return await this.PoolsRepo.addParticipant({
      name, pollID, userID
    })

  }

  async rejoin(rejoin: rejoinPollFields) {
    return rejoin;
  }
}
