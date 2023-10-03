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
  //  nominations ,
  //  rankings ,
  //  results ,
}
