import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { actions, state } from '../state';
import ResultCard from '../components/ui/ResultCard';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

const Results: React.FC = () => {
  const { rankingsCount, poll, participantCount, isAdmin } = useSnapshot(state);
  const [isEndPoll, setIsEndPoll] = useState<boolean>(false);
  const [isLeavePoll, setIsLeavePoll] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col mx-auto w-full h-full max-w-sm items-center justify-between">
        <div className="w-full">
          {/* <div className="text-center font-semibold mt-12 mb-4">Results</div> */}
          {poll?.results.length ? (
            <>
              <ResultCard results={poll.results} />{' '}
            </>
          ) : (
            <>
              <p className="text-center text-xl">
                <span className="text-orange-600">{rankingsCount}</span>
                of <span className="text-purple-600">
                  {participantCount}
                </span>{' '}
                participants has voted .
              </p>
            </>
          )}
        </div>
        <div>
          {isAdmin && !poll?.results.length && (
            <>
              <button
                onClick={() => setIsEndPoll(true)}
                className="btn-orange box my-2"
              >
                End Poll
              </button>
            </>
          )}
          {!isAdmin && poll?.results.length && (
            <>
              <div className="italic my-2 ">
                waiting for Admin ,{poll.participants[poll.adminId]},to End the
                poll.
              </div>
            </>
          )}

          {!!poll?.results.length && (
            <>
              <button
                onClick={() => setIsLeavePoll(true)}
                className="btn-purple box my-2"
              >
                Leave Poll
              </button>
            </>
          )}
        </div>
      </div>
      <ConfirmationDialog
        message="Are You Sure You want To leave The poll ? "
        onCancel={() => setIsLeavePoll(false)}
        onConfirm={actions.startOver}
        showDialog={isLeavePoll}
      />
      <ConfirmationDialog
        message="are you sure you want to end the poll and calculate Results "
        onCancel={() => setIsEndPoll(false)}
        showDialog={isEndPoll}
        onConfirm={() => {
          setIsEndPoll(false);
          actions.endPoll();
        }}
      />
    </>
  );
};

export default Results;
