export interface Participants {
  [participantId: string]: string;
}
export interface Poll {
  id: string;
  topic: string;
  votesPerVoter: number;
  adminId: string;
  participants: Participants;
  hasStarted: boolean
  //   TODO 
  nominations: Nominations,
  //  rankings ,
  //  results ,
}


type NominationID = string
export type Nominations = {
  [nominationID: NominationID]: Nomination
}

export type Nomination = {
  userID: string,
  text: string;
}