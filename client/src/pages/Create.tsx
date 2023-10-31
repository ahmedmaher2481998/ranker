import React, { useState } from 'react';
import CountSelector from '../components/ui/CountSelector';
import { actions } from '../state';
import { makeRequest } from '../api';

const Create: React.FC = () => {
  const [pollTopic, setPollTopic] = useState('');
  const [maxVotes, setMaxVotes] = useState(3);
  const [name, setName] = useState('');
  const [apiError, setApiError] = useState('');

  const areFieldsValid = (): boolean => {
    if (pollTopic.length > 100 || pollTopic.length < 1) return false;
    else if (maxVotes > 5 || maxVotes < 1) return false;
    else if (name.length > 25 || name.length < 1) return false;
    else return true;
  };
  const handleCreatePoll = async () => {};
  return (
    <div className="flex flex-col w-full justify-center items-stretch  h-full mx-auto max-w-sm ">
      <div className="mb-12">
        <label className=" text-center">Enter Poll</label>
        <div className="text-center w-full">
          <input
            type="text"
            className="box info w-full"
            maxLength={100}
            onChange={(e) => setPollTopic(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-center mt-4 mb-2">Votes Per Participant</h3>
        <div className="w-48 mx-auto my-4">
          <CountSelector
            initial={3}
            max={5}
            min={1}
            onChange={(val) => setMaxVotes(val)}
            step={1}
          />
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-center">Enter Name</h3>
        <div className="text-center w-full">
          <input
            type="text"
            className="box info w-full"
            maxLength={25}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      {apiError && (
        <p className="mb-12 text-center text-red-600 font-light mt-8">
          {apiError}
        </p>
      )}
      <div className="flex flex-col justify-center items-center">
        <button
          disabled={!areFieldsValid()}
          onClick={() => {
            console.log('Create');
          }}
          className="box btn-orange w-32 my-2"
        >
          Create
        </button>
        <button
          onClick={() => actions.startOver()}
          className="box btn-purple w-32 my-2"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default Create;
