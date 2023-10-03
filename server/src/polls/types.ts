import { CreatePollDto } from './dtos';
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


export class AddParticipantFields {
  name: string;
  userID: string;
  pollID: string;
};

export class RemoveParticipantFields {
  userID: string;
  pollID: string;
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

export type RemoveParticipantData = {
  userID: string;
  pollID: string;
};


// Auth types 
type AuthPayload = {
  userID: string, pollID: string, name: string
}
export type RequestWithAuth = AuthPayload & Request
export type SocketWithAuth = AuthPayload & Socket


// The names of the events used in the pools namespace 
export enum events {
  exception = "exception",
  pollUpdated = "poll_updated"

}