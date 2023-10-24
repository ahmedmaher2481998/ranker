import { Nominations, Rankings, Results } from "shared";

export const getPollResults = ({
    nominations,
    rankings,
    votesPerVoter,
}: {
    nominations: Nominations;
    rankings: Rankings;
    votesPerVoter: number;
}): Results => {
    const voteValue = (n) =>
        Math.pow((votesPerVoter - 0.5 * n) / votesPerVoter, n + 1);
    // 1. Each value of `rankings` key values is an array of a participants'
    // vote. Points for each array element corresponds to following formula:
    // r_n = ((votesPerVoter - 0.5*n) / votesPerVoter)^(n+1), where n corresponds
    // to array index of rankings.
    // Accumulate score per nominationID
    const scores: {
        [nominationID: string]: number;
    } = {};

    Object.values(rankings).forEach((rankingArray) => {
        rankingArray.forEach((nominationID, n) => {
            const value = voteValue(n);

            scores[nominationID] = (scores[nominationID] ?? 0) + value;
        });
    });

    const results = Object.entries(scores).map(([nominationID, score]) => ({
        nominationID,
        score,
        nominationText: nominations[nominationID].text as string,
    }));

    // 3. Sort values by score in descending order
    results.sort((res1, res2) => res2.score - res1.score);

    return results;

};
