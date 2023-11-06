import React, { useEffect } from 'react';
import { actions, state } from '../state';
import { useSnapshot } from 'valtio';

const WaitingRoom: React.FC = () => {
  useEffect(() => {
    console.log(`Connecting to socket `);
    actions.initializeSocket();
  }, []);

  return (
    <div className="flex flex-col w-full justify-around items-stretch  h-full mx-auto max-w-sm ">
      <h3 className="text-center">Waiting Room </h3>
    </div>
  );
};

export default WaitingRoom;
