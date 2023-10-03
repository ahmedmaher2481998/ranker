import { Injectable } from "@nestjs/common";
import {
  AddParticipantFields,
  RemoveParticipantFields,
  createPollFields,
  joinPollFields,
  rejoinPollFields,
} from "./types";
import { generateUserId, generatePollId } from "src//ids";
import { PollsRepository } from "./polls.repository";
type getSignedStringProps = {
  userName: String;
  pollID: string;
  userID: string;
};
import { JwtService } from "@nestjs/jwt";
import { Poll } from "shared";
@Injectable()
export class PollsService {
  constructor(
    private readonly pollsRepo: PollsRepository,
    private readonly jwtService: JwtService
  ) { }

  async getSignedString({ userName, userID, pollID }: getSignedStringProps) {
    const accessToken = await this.jwtService.sign(
      { pollID, name: userName },
      {
        subject: userID,
      }
    );
    return accessToken;
  }

  async create({ name, topic, votesPerVoter }: createPollFields) {
    const pollID = generatePollId();
    const userID = generateUserId();
    await this.pollsRepo.createPoll({
      pollID,
      userID,
      topic,
      votesPerVoter,
    });
    const poll = await this.pollsRepo.getPoll(pollID);
    const accessToken = await this.getSignedString({
      pollID,
      userID,
      userName: name,
    });
    return { poll, accessToken };
  }

  async join({ name, pollID }: joinPollFields) {
    const userID = generateUserId();
    const poll = await this.pollsRepo.addParticipant({
      name,
      pollID,
      userID,
    });
    const accessToken = await this.getSignedString({
      pollID,
      userID,
      userName: name,
    });
    return {
      poll,
      accessToken,
    };
  }

  async rejoin(rejoin: rejoinPollFields) {
    return rejoin;
  }

  async addParticipantToPoll(addParticipantFields: AddParticipantFields) {
    return this.pollsRepo.addParticipant(addParticipantFields);
  }
  async getPollById(pollID: string) {
    return this.pollsRepo.getPoll(pollID);
  }
  async removeParticipantFromPoll(
    removeParticipantFields: RemoveParticipantFields
  ): Promise<Poll | void> {
    const { userID, pollID } = removeParticipantFields;

    const poll = await this.pollsRepo.getPoll(pollID);

    if (!poll.hasStarted) {

      const updatedPoll = await this.pollsRepo.removeParticipant(
        removeParticipantFields
      );
      if (updatedPoll) {
        return updatedPoll;
      }

    }
  }
}
