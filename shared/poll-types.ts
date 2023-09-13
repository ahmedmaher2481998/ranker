export interface Participants {
  [participantId: string]: string;
}
export interface Poll {
  id: string;
  topic: string;
  votesPerVoter: number;
  adminId: string;
  participants: Participants;
  //   TODO 
  //  nominations ,
  //  rankings ,
  //  results ,
  //  hasStarted
}
