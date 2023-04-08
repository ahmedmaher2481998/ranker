import { CreatePollDto, JoinPollDto } from './dtos';

export class createPollFields extends CreatePollDto {}
export class joinPollFields {
  pollId: string;
  name: string;
}
export class rejoinPollFields {
  name: string;
  userId: string;
  pollId: string;
}
