import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthRoute = (component, authenticated, ...rest) => (
  <Route
    {...rest}
    render={() =>
      authenticated ? <Redirect to="/" /> : <component {...rest} />
    }
  />
);

export default AuthRoute;
