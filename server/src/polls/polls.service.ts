import { Injectable } from '@nestjs/common';
import { createPollFields, joinPollFields, rejoinPollFields } from './types';
import { generateUserId, generatePollId } from 'src//ids';
@Injectable()
export class PollsService {
  async create(poll: createPollFields) {
    poll['pollId'] = generatePollId();
    poll['userId'] = generateUserId();
    return poll;
  }

  async join(joinPoll: joinPollFields) {
    joinPoll['userId'] = generateUserId();
    return joinPoll;
  }

  async rejoin(rejoin: rejoinPollFields) {
    return rejoin;
  }
}
