import { Injectable } from '@nestjs/common';
import { createPollFields, joinPollFields, rejoinPollFields } from './types';
import { generateUserId, generatePollId } from 'src//ids';
import { PollsRepository } from './polls.repository';
type getSignedStringProps = {
  userName: String, pollID: string, userID: string
}
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class PollsService {
  constructor(
    private readonly pollsRepo: PollsRepository, private readonly jwtService: JwtService
  ) { }

  async getSignedString({ userName, userID, pollID }: getSignedStringProps) {

    const accessToken = await this.jwtService.sign({ pollID, name: userName }, {
      subject: userID
    })
    return accessToken
  }

  async create({ name, topic, votesPerVoter }: createPollFields) {
    const pollID = generatePollId();
    const userID = generateUserId();
    await this.pollsRepo.createPoll({
      pollID, userID, topic, votesPerVoter
    })
    const poll = await this.pollsRepo.getPoll(pollID)
    const accessToken = await this.getSignedString({
      pollID, userID, userName: name
    })
    return { poll, accessToken }
  }

  async join({
    name, pollID
  }: joinPollFields) {
    const userID = generateUserId()
    const poll = await this.pollsRepo.addParticipant({
      name, pollID, userID
    })
    const accessToken = await this.getSignedString({ pollID, userID, userName: name })
    return {
      poll, accessToken
    }

  }

  async rejoin(rejoin: rejoinPollFields) {
    return rejoin;
  }
}
