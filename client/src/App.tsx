import React, { useEffect } from 'react';
import { devtools } from 'valtio/utils';
import './index.css';
import Pages from './Pages';
import { actions, state } from './state';
import Loader from './components/ui/Loader';
import { useSnapshot } from 'valtio';
import { getTokenPayload } from './util';
import SnackBar from './components/ui/SnackBar';

devtools(state, { name: 'app state' });

const App: React.FC = () => {
  const currentState = useSnapshot(state);

  useEffect(() => {
    console.log(`Start Connecting from App UseEffect  - using access token `);
    actions.startLoading();

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      actions.stopLoading();
      return;
    }

    const { exp } = getTokenPayload(accessToken);
    const currentTime = Date.now() / 1000 - 10;

    if (exp < currentTime) {
      localStorage.removeItem('accessToken');
      actions.stopLoading();
      return;
    }

    actions.setPollAccessToken(accessToken);
    actions.initializeSocket();
  }, []);
  useEffect(() => {
    console.log('App useEffect - check current participant');
    const myId = currentState.me?.id;
    if (
      myId &&
      currentState.socket?.connect &&
      !currentState.poll?.participants[myId]
    ) {
      actions.startOver();
    }
  }, [currentState.poll?.participants]);
  return (
    <>
      {currentState.wsError.map((err) => (
        <SnackBar
          type="error"
          message={err.message}
          onClose={() => actions.removeWsError(err.id)}
          show={true}
          autoCloseDuration={5000}
          key={err.id}
          title={err.type}
        />
      ))}
      <Loader color="orange" isLoading={currentState.loading} width={150} />
      <Pages />
    </>
  );
};

export default App;
