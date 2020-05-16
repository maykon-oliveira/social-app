import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const AuthRoute = (component: Component, authenticated, ...rest) => (
  <Route
    {...rest}
    render={() =>
      authenticated ? <Redirect to="/" /> : <Component {...rest} />
    }
  />
);

export default AuthRoute;
