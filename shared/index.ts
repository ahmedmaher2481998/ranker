export * from "./poll-types";
export enum socketEvents {
    exception = "exception",
    pollUpdated = "poll_updated",
    removeParticipant = "remove_participant",
    addNomination = "add_nomination",
    removeNomination = "remove_nomination",
    startPoll = "start_poll",
    submitRankings = "submit_rankings",
    closePoll = "close_poll",
    cancelPoll = "cancel_poll",
    pollCancelled = "poll_cancelled"
}
