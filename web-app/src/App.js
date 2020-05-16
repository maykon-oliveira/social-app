import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import "./App.css";

import { Home } from "./pages/Home";
import Login from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Navbar } from "./components/Navbar";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
