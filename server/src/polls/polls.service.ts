import { BadRequestException, Injectable } from "@nestjs/common";
import {
  AddNominationFields,
  AddParticipantFields,
  AddParticipantRankingsFields,
  RemoveNominationFields,
  RemoveParticipantFields,
  StartPollFields,
  createPollFields,
  joinPollFields,
  rejoinPollFields,
} from "./types/types";
import { generateUserId, generatePollId, generateNominationId } from "src//ids";
import { PollsRepository } from "./polls.repository";
type getSignedStringProps = {
  userName: String;
  pollID: string;
  userID: string;
};
import { JwtService } from "@nestjs/jwt";
import { Poll } from "shared";
import { WsBadRequestException } from "src/exceptions/WsEception";
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
    const pollData = {
      pollID,
      userID,
      topic,
      votesPerVoter,
    };
    await this.pollsRepo.createPoll(pollData);
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
    removeParticipant: RemoveParticipantFields
  ): Promise<Poll | void> {
    const { userID, pollID } = removeParticipant;

    const poll = await this.pollsRepo.getPoll(pollID);

    if (!poll.hasStarted) {
      const updatedPoll = await this.pollsRepo.removeParticipant(
        removeParticipant
      );
      if (updatedPoll) {
        return updatedPoll;
      }
    }
  }

  async addNomination({ pollID, text, userID }: AddNominationFields) {
    const nominationID = generateNominationId();
    return await this.pollsRepo.addNomination({
      nomination: {
        text,
        userID,
      },
      nominationID,
      pollID,
    });
  }

  async removeNomination({ nominationID, pollID }: RemoveNominationFields) {
    return await this.pollsRepo.removeNomination({
      nominationID,
      pollID,
    });
  }

  async startPoll({ pollID }: StartPollFields) {
    return await this.pollsRepo.startPoll(pollID);
  }

  async submitParticipantRankings(rankingsData: AddParticipantRankingsFields) {
    const poll = await this.pollsRepo.getPoll(rankingsData.pollID);
    if (!poll.hasStarted)
      throw new BadRequestException(
        `poll with id ${rankingsData.pollID} has not started yet.`
      );
    return await this.pollsRepo.addParticipantRankings(rankingsData);
  }
}
