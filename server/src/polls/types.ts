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
// Polls Repository Types
export type CreatePollData = {
  pollId: string;
  userId: string;
  votesPerVoter: number;
  topic: string;
};
export type AddParticipantData = {
  name: string;
  userId: string;
  pollId: string;
};
