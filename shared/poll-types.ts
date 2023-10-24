export interface Participants {
  [participantId: string]: string;
}
type NominationID = string
type Rankings = {
  [userId: string]: NominationID[]
}
export interface Poll {
  id: string;
  topic: string;
  votesPerVoter: number;
  adminId: string;
  participants: Participants;
  hasStarted: boolean
  nominations: Nominations,
  rankings: Rankings,
  //   TODO 
  //  results ,
}

export type Nomination = {
  userID: string,
  text: string;
}
export type Nominations = {
  [nominationID: NominationID]: Nomination
}
