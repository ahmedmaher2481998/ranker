import {
  Injectable,
  Logger,
  Inject,
  InternalServerErrorException,
  ForbiddenException,
  UseGuards,
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
} from "./types/types";
import { Poll } from "shared";
import { GatewayAdminGuard } from "./guards/admin-gateway.guard";
@Injectable()
export class PollsRepository {
  // time to live
  private til: string;
  private logger = new Logger(PollsRepository.name);
  public getKey = (pollId: string) => `polls:${pollId}`;

  constructor(
    private readonly configService: ConfigService,
    @Inject(IoRedisKey) private readonly redis: Redis
  ) {
    this.til = configService.get("POLL_DURATION");
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
    };
    const key = this.getKey(pollID);

    this.logger.log(
      `Creating new poll: ${initialPoll.topic} with TTL ${this.til}`
    );
    try {
      // thanks ChatGPT :)
      await this.redis.set(key, JSON.stringify(initialPoll), "EX", this.til);
      return initialPoll;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${error}`
      );
    }
    throw new InternalServerErrorException();
  }

  async getPoll(pollID: string): Promise<Poll> {
    try {
      this.logger.log(`getting poll with id  ${pollID}`);
      const poll = await this.redis.get(this.getKey(pollID));
      if (!poll) throw new ForbiddenException("poll doesn't exist ...");
      this.logger.verbose(poll);
      return JSON.parse(poll) as Poll;
    } catch (error) {
      this.logger.error(`Failed to get poll with id ${pollID}`);
      throw new InternalServerErrorException(error.name);
    }
  }

  async addParticipant({
    name,
    pollID,
    userID,
  }: AddParticipantData): Promise<Poll> {
    try {
      const poll = (await this.getPoll(pollID)) as Poll;
      poll.participants[`${userID}`] = name;
      await this.redis.set(this.getKey(pollID), JSON.stringify(poll));

      return await this.getPoll(pollID);
    } catch (error) {
      throw error;
    }
  }

  async removeParticipant({
    pollID,
    userID,
  }: RemoveParticipantData): Promise<Poll> {
    try {
      const poll = (await this.getPoll(pollID)) as Poll;
      delete poll.participants[`${userID}`];
      await this.redis.set(this.getKey(pollID), JSON.stringify(poll));
      return await this.getPoll(pollID);
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to remove Participant wit Id" + userID
      );
    }
  }

  async addNomination({ nomination, nominationID, pollID }: AddNominationData) {
    // const key = this.getKey(pollID);
    // const nominationPath = `.nominations.${nominationID}`;

    this.logger.debug(`adding nomination  to poll ${pollID}`, nomination);
    try {
      // await this.redis.send_command(`JSON.SET`, [key, nominationPath, JSON.stringify(nomination)])
      const poll = await this.getPoll(pollID)
      poll.nominations[`${nominationID}`] = nomination
      this.redis.set(this.getKey(pollID), JSON.stringify(poll))
      return await this.getPoll(pollID);
    } catch (error) {
      this.logger.debug('Error happened in polls repo ', error)
      throw new InternalServerErrorException(
        `failed to add nomination to ${pollID} , nomination :  ${JSON.stringify(
          nomination
        )} `
      );
    }
  }

  async removeNomination({ nominationID, pollID }: RemoveNominationData) {

    // const key = this.getKey(pollID);

    // const nominationPath = `.nominations.${nominationID}`;

    this.logger.debug(
      `removing  nomination  to poll ${pollID} with id ${nominationID}`
    );

    try {
      // await this.redis.send_command("JSON.DEL", key, nominationPath);

      const poll = await this.getPoll(pollID);
      delete poll.nominations[`${nominationID}`]
      this.redis.set(this.getKey(pollID), JSON.stringify(poll))
      return await this.getPoll(pollID);
    } catch (error) {
      throw new InternalServerErrorException(
        `failed to remove nomination to ${pollID} , nomination :  ${nominationID} `
      );
    }
  }
}
