import React, { useState } from 'react';
import { AppPage, actions } from '../state';
import { makeRequest } from '../api';
import { Poll } from 'shared/poll-types';

const Join: React.FC = () => {
  const [apiError, setApiError] = useState('');
  const [name, setName] = useState('');
  const [pollID, setPollID] = useState('');

  const areFieldsValid: () => boolean = () => {
    if (name.length > 25 || name.length < 1) return false;
    else if (pollID.length !== 6) return false;
    else return true;
  };

  const handleJoinPoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>('/api/polls/join', {
      method: 'POST',
      body: JSON.stringify({
        pollID,
        name,
      }),
    });

    if (error && error.statusCode === 400) {
      setApiError('Please Make sure to Code Is Correct ');
    } else if (error && !error?.statusCode) {
      setApiError('Unknown Api Error ');
    } else {
      actions.initializePoll(data.poll);
      actions.setPollAccessToken(data.accessToken);
      actions.setPage(AppPage.waitingRoom);
    }
    actions.stopLoading();
  };
  return (
    <div className="flex flex-col w-full justify-around items-stretch  h-full mx-auto max-w-sm ">
      <div className="mb-12">
        <div className="my-4">
          <h3 className="text-center">Enter Code Provided by {`"Friend"`}</h3>
          <div className="text-center w-full">
            <input
              type="text"
              autoCapitalize="characters"
              onChange={(e) => setPollID(e.target.value.toUpperCase())}
              className="box info w-full "
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>
        <div className="my-4">
          <h3 className="text-center">Your Name</h3>
          <div className="text-center w-full">
            <input
              type="text"
              className="info w-full box"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        {apiError && (
          <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
        )}
        <div className="flex flex-col justify-center items-center my-4 ">
          <button
            disabled={!areFieldsValid()}
            onClick={handleJoinPoll}
            className="box btn-orange w-32 my-2"
          >
            Join
          </button>

          <button
            onClick={() => {
              actions.startOver();
            }}
            className="box btn-purple w-32 my-2"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;
