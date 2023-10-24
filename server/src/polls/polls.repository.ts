import {
  Injectable,
  Logger,
  Inject,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoRedisKey } from "src/config/redis.module";
import { Redis } from "ioredis";
import {
  AddNominationData,
  AddParticipantData,
  CreatePollData,
  RemoveNominationData,
  RemoveParticipantData,
  AddParticipantRankingsData,
} from "./types/types";
import { Poll } from "shared";
import { GatewayAdminGuard } from "./guards/admin-gateway.guard";
import { wsInternalServerError } from "src/exceptions/WsEception";
@Injectable()
export class PollsRepository {
  // time to live
  private ttl: number;
  private logger = new Logger(PollsRepository.name);
  public getKey = (pollId: string) => `polls:${pollId}`;

  constructor(
    private readonly configService: ConfigService,
    @Inject(IoRedisKey) private readonly redis: Redis
  ) {
    this.ttl = parseInt(configService.get("POLL_DURATION"));
  }

  async createPoll({
    pollID,
    topic,
    userID,
    votesPerVoter,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      adminId: userID,
      topic,
      id: pollID,
      hasStarted: false,
      votesPerVoter,
      participants: {},
      nominations: {},
      rankings: {}
    };
    const key = this.getKey(pollID);

    this.logger.log(
      `Creating new poll: ${initialPoll.topic} with TTL ${this.ttl}`
    );
    try {

      await this.redis
        .send_command(
          'JSON.SET', key, '.', JSON.stringify(initialPoll))
      await this.redis.expire(key, this.ttl)
      return initialPoll;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${error}`
      );
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    try {
      this.logger.log(`getting poll with id  ${pollID}`);
      const poll = await this.redis.send_command("JSON.GET", this.getKey(pollID));
      if (!poll) throw new ForbiddenException("poll doesn't exist ...");
      else this.logger.verbose(poll);
      return JSON.parse(poll) as Poll;
    } catch (error) {
      this.logger.error(`Failed to get poll with id ${pollID}`);
      throw new InternalServerErrorException("DB Error", error.message);
    }
  }

  async addParticipant({
    name,
    pollID,
    userID,
  }: AddParticipantData): Promise<Poll> {
    try {
      await this.redis.send_command('JSON.SET', this.getKey(pollID), `.participants.${userID}`, JSON.stringify(name))
      return await this.getPoll(pollID);
    } catch (error) {
      this.logger.error('Error joining a poll', error)
      throw error;
    }
  }

  async removeParticipant({
    pollID,
    userID,
  }: RemoveParticipantData): Promise<Poll> {
    try {
      const key = this.getKey(pollID)
      const path = `.participants.${userID}`

      await this.redis.send_command("JSON.DEL", key, path)
      return await this.getPoll(pollID);
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to remove Participant wit Id" + userID
      );
    }
  }

  async addNomination({ nomination, nominationID, pollID }: AddNominationData) {

    const key = this.getKey(pollID);
    const nominationPath = `.nominations.${nominationID}`;
    this.logger.debug(`adding nomination  to poll ${pollID}`, nomination);
    try {
      await this.redis.send_command(
        'JSON.SET',
        key,
        nominationPath,
        JSON.stringify(nomination),
      );
      return await this.getPoll(pollID);
    } catch (error) {
      console.error('Error happened in polls repo ', error)
      throw new InternalServerErrorException(
        `failed to add nomination to ${pollID} , nomination :  ${JSON.stringify(
          nomination
        )} `
      );
    }
  }

  async removeNomination({ nominationID, pollID }: RemoveNominationData) {


    this.logger.debug(
      `removing  nomination  to poll ${pollID} with id ${nominationID}`
    );

    try {

      const key = this.getKey(pollID)
      const path = `.nominations.${nominationID}`
      await this.redis.send_command('JSON.DEL', key, path)
      return await this.getPoll(pollID);
    } catch (error) {
      throw new InternalServerErrorException(
        `failed to remove nomination to ${pollID} , nomination :  ${nominationID} `
      );
    }
  }

  async startPoll(pollID: string) {
    this.logger.log(`setting hasStarted for poll: ${pollID}`);
    const key = this.getKey(pollID)
    const path = ".hasStarted"
    try {
      await this.redis.send_command(
        "JSON.SET",
        key,
        path,
        JSON.stringify(true)
      )
      return await this.getPoll(pollID)

    } catch (error) {
      throw new InternalServerErrorException(
        `failed to start poll ${pollID} `
        , error.message);
    }

  }


  async addParticipantRankings({ pollID, rankings, userID }: AddParticipantRankingsData) {
    this.logger.log(
      `Attempting to add rankings for userID/name: ${userID} to pollID: ${pollID}`,
      rankings,
    );

    try {
      const key = this.getKey(pollID)
      const path = `.rankings.${userID}`
      await this.redis.send_command("JSON.SET", key, path, JSON.stringify(rankings))
      return await this.getPoll(pollID)
    } catch (err) {
      this.logger.error(`Failed to submit rankings for userID : ${userID} rankings`, rankings)
      this.logger.error(err.message)
      throw new InternalServerErrorException(err.message)

    }
  }
}
