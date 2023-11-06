import React from 'react';
import { devtools } from 'valtio/utils';
import './index.css';
import Pages from './Pages';
import { state } from './state';
import Loader from './components/ui/Loader';
import { useSnapshot } from 'valtio';

devtools(state, 'app state');

const App: React.FC = () => {
  const currentState = useSnapshot(state);
  return (
    <>
      <Loader color="orange" isLoading={currentState.loading} width={150} />
      <Pages />
    </>
  );
};

export default App;
