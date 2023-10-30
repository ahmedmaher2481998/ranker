import React from 'react';
import Welcome from './pages/Welcome';
import { AppPage } from './state';
import Create from './pages/Create';
import Join from './pages/Join';

const routeConfig = {
  [AppPage.welcome]: Welcome,
  [AppPage.create]: Create,
  [AppPage.join]: Join,
};
const Pages = () => {
  return (
    <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
      <Welcome />
    </div>
  );
};

export default Pages;
