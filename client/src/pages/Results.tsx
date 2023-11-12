import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { state } from '../state';

const Results: React.FC = () => {
  const { hasVoted, rankingsCount, poll } = useSnapshot(state);
  const [isEndPoll, setIsEndPoll] = useState<boolean>(false);
  const [isLeavePoll, setIsLeavePoll] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col mx-auto w-full h-full max-w-sm items-center justify-between">
        <div className="w-full">
          <div className="text-center font-semibold mt-12 mb-4">Results</div>
        </div>
      </div>
    </>
  );
};

export default Results;
