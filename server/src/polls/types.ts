import { Request } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos';
import { Socket } from 'socket.io';

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



// Auth types 
type AuthPayload = {
  userID: string, pollID: string, name: string
}
export type RequestWithAuth = AuthPayload & Request
export type SocketWithAuth = AuthPayload & Socket
