import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { state, actions } from '../state';
import RankedCheckBox from '../components/ui/RankedCheckBox';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

const Voting: React.FC = () => {
  const currentState = useSnapshot(state);
  const [rankings, setRankings] = useState<string[]>([]);
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false);
  const [confirmVote, setConfirmVote] = useState<boolean>(false);
  const toggleNomination = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);
    const hasRemainingVotes =
      (currentState.poll?.votesPerVoter || 0) - rankings.length;
    if (hasRemainingVotes && position < 0) {
      setRankings([...rankings, id]);
    } else {
      setRankings([
        ...rankings.slice(0, position),
        ...rankings.slice(position + 1, rankings.length),
      ]);
    }
  };
  const getRank = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);

    return position < 0 ? undefined : position + 1;
  };
  return (
    <>
      <div className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sm">
        <div className="w-full">
          {/* <h1 className="text-center">Voting Page</h1> */}
          {currentState.poll && (
            <>
              <div className="text-center text-xl font-semibold mb-6">
                Select Your Top {currentState.poll.votesPerVoter} Choices
              </div>
              <div className="text-center text-lg font-semibold mb-6 text-indigo-700">
                {currentState.poll.votesPerVoter - rankings.length} Votes
                Remaining
              </div>
            </>
          )}

          <div className="px-2">
            {Object.entries(currentState.poll?.nominations || {}).map(
              ([id, nomination]) => {
                return (
                  <RankedCheckBox
                    key={id}
                    onSelect={() => toggleNomination(id)}
                    value={nomination.text}
                    rank={getRank(id)}
                  />
                );
              }
            )}
          </div>
        </div>
        <div>
          <button
            className="box btn-purple my-2 w-36"
            disabled={
              rankings.length < (currentState.poll?.votesPerVoter ?? 100)
            }
            onClick={() => setConfirmVote(true)}
          >
            Submit Votes
          </button>
          <ConfirmationDialog
            message="You cannot change your vote after submitting"
            onCancel={() => setConfirmVote(false)}
            showDialog={confirmVote}
            onConfirm={() => actions.submitRankings(rankings)}
          />

          {currentState.isAdmin && (
            <div>
              <button
                onClick={() => setConfirmCancel(true)}
                className="box w-36 my-2  btn-orange"
              >
                Cancel Poll
              </button>

              <ConfirmationDialog
                message="This will cancel the poll and remove all users!"
                onCancel={() => setConfirmCancel(false)}
                onConfirm={() => actions.cancelPoll()}
                showDialog={confirmCancel}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Voting;
