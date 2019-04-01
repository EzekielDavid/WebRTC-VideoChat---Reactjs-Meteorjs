import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import AppContainer from '../../ui/containers/AppContainer.js'
import Login from '../../ui/pages/login.js';
import NotFoundPage from '../../ui/pages/notfound.js';
// // route components
// import AppContainer from '../../ui/containers/AppContainer.js';
// import ListPageContainer from '../../ui/containers/ListPageContainer.js';
// import AuthPageJoin from '../../ui/pages/AuthPageJoin.js';


const browserHistory = createBrowserHistory();


export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact={true} path="/" component={AppContainer}/>
      <Route exact path="/login" component={Login}/>
      <Route component={NotFoundPage}/>
    </Switch>
  </Router>
);