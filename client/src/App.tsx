import React, { useEffect } from 'react';
import { devtools } from 'valtio/utils';
import './index.css';
import Pages from './Pages';
import { actions, state } from './state';
import Loader from './components/ui/Loader';
import { useSnapshot } from 'valtio';
import { getTokenPayload } from './util';

devtools(state, 'app state');

const App: React.FC = () => {
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

  const currentState = useSnapshot(state);
  return (
    <>
      <Loader color="orange" isLoading={currentState.loading} width={150} />
      <Pages />
    </>
  );
};

export default App;
