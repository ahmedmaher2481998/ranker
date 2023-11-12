import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import Welcome from './pages/Welcome';
import { AppPage, actions, state } from './state';
import Create from './pages/Create';
import Join from './pages/Join';
import { CSSTransition } from 'react-transition-group';
import Loader from './components/ui/Loader';
import WaitingRoom from './pages/WaitingRoom';

const routeConfig = {
  [AppPage.welcome]: Welcome,
  [AppPage.create]: Create,
  [AppPage.join]: Join,
  [AppPage.waitingRoom]: WaitingRoom,
};
const Pages = () => {
  const currentState = useSnapshot(state);

  useEffect(() => {
    // to redirect the user to the waiting room if the poll didn't start and we could connect correctly and we could assign find the token in the storage
    if (
      (currentState.me?.id && !currentState.poll?.hasStarted, currentState.poll)
    ) {
      actions.setPage(AppPage.waitingRoom);
    }
  }, [currentState.me?.id, currentState.poll?.hasStarted]);

  return (
    <>
      {Object.entries(routeConfig).map(([page, Component]) => (
        <CSSTransition
          key={page}
          in={page === currentState.currentPage}
          timeout={300}
          classNames={'page'}
          unmountOnExit
        >
          <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
            <Component />
          </div>
        </CSSTransition>
      ))}
    </>
  );
};

export default Pages;
