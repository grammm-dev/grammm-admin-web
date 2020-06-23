import React from "react";
import PropTypes from 'prop-types';

import { Switch } from "react-router-dom";

import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import AsyncComponent from './components/AsyncComponent';

const AsyncLogin = AsyncComponent(() => import("./containers/Login"));
const AsyncMenu = AsyncComponent(() => import("./containers/Menu"));
const AsyncDataAreaSetup = AsyncComponent(() => import("./containers/DataAreaSetup"));
const AsyncDomainList = AsyncComponent(() => import("./containers/DomainList"));
const AsyncDomainListDetails = AsyncComponent(() => import("./containers/DomainListDetails"));

const Routes = ({ childProps }) => (
  <Switch>
    <AuthenticatedRoute
      path="/"
      exact
      component={AsyncMenu}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={AsyncLogin}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/DataAreaSetup"
      exact
      component={AsyncDataAreaSetup}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/DomainList"
      exact
      component={AsyncDomainList}
      props={childProps}
    />
    <AuthenticatedRoute
      path={[
        "/DomainList/:domainID",
        "/DomainList/add",
      ]}
      exact
      component={AsyncDomainListDetails}
      props={childProps}
    />
  </Switch>
);

Routes.propTypes = {
  childProps: PropTypes.object,
};

export default Routes;
