export interface Participants {
  [participantId: string]: string;
}
type NominationID = string
export type Rankings = {
  [userId: string]: NominationID[]
}
export type Results = Array<{
  nominationID: NominationID,
  nominationText: string,
  score: number
}>
export interface Poll {
  id: string;
  topic: string;
  votesPerVoter: number;
  adminId: string;
  participants: Participants;
  hasStarted: boolean
  nominations: Nominations,
  rankings: Rankings,
  results: Results,
}

export type Nomination = {
  userID: string,
  text: string;
}
export type Nominations = {
  [nominationID: NominationID]: Nomination
}
