import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import "./App.css";
import jwtDecode from "jwt-decode";

import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRoute from "./utils/AuthRoute";
import { Navbar } from "./components/Navbar";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  form: {
    textAlign: "center",
  },
  pageTitle: {
    margin: "10px auto",
  },
  textField: {
    margin: "10px auto",
  },
  wrapper: {
    position: "relative",
    margin: "10px auto",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  error: {
    marginBottom: 10,
  },
});

const token = sessionStorage.getItem("FBToken");
let autheticated = false;
if (token) {
  const decoded = jwtDecode(token);
  autheticated = decoded.exp * 1000 < Date.now();
  if (!autheticated) {
    window.location.href = "/login";
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute
                exact
                path="/login"
                component={Login}
                autheticated={autheticated}
              />
              <AuthRoute
                exact
                path="/signup"
                component={Signup}
                autheticated={autheticated}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
