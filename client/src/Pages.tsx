import React from 'react';
import { useSnapshot } from 'valtio';
import Welcome from './pages/Welcome';
import { AppPage, state } from './state';
import Create from './pages/Create';
import Join from './pages/Join';
import { CSSTransition } from 'react-transition-group';

const routeConfig = {
  [AppPage.welcome]: Welcome,
  [AppPage.create]: Create,
  [AppPage.join]: Join,
};
const Pages = () => {
  const currentState = useSnapshot(state);
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
