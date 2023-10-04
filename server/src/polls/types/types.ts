import { Nomination } from "shared";
import { CreatePollDto } from "./dtos";
import { Socket } from "socket.io";

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
}

export class RemoveParticipantFields {
  userID: string;
  pollID: string;
}

export class AddNominationFields {
  text: string;
  pollID: string;
  userID: string;
}

export class RemoveNominationFields {
  pollID: string;
  nominationID: string;
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

export type AddNominationData = {
  pollID: string;
  nominationID: string;
  nomination: Nomination;
};

export type RemoveNominationData = {
  pollID: string;
  nominationID: string;
};

// Auth types
export type AuthPayload = {
  userID: string;
  pollID: string;
  name: string;
};
export type RequestWithAuth = AuthPayload & Request;
export type SocketWithAuth = AuthPayload & Socket;

// The names of the events used in the pools namespace
export enum events {
  exception = "exception",
  pollUpdated = "poll_updated",
  removeParticipant = "remove_participant",
  addNomination = 'add_nomination',
  removeNomination = 'remove_nomination'
}
