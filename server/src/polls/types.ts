import { CreatePollDto, JoinPollDto } from './dtos';

export class createPollFields extends CreatePollDto { }

export class joinPollFields {
  pollID: string;
  name: string;
}
export class rejoinPollFields {
  userID: string;
  pollID: string;
  name: string;
}
// Polls Repository Types
export type CreatePollData = {
  pollID: string;
  userID: string;
  votesPerVoter: number;
  topic: string;
};

export type AddParticipantData = {
  name: string;
  userID: string;
  pollID: string;
};
