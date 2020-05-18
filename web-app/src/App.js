import React, { useEffect } from "react";
import { Route, Switch, Router } from "react-router-dom";

import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";
import { Provider } from "react-redux";
import store from "./store";
import { TOKEN_KEY, Types } from "./store/ducks/user";

import history from "./utils/history";

import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRoute from "./utils/AuthRoute";
import { Navbar } from "./components/Navbar";

import "./App.css";
import Axios from "axios";

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

function App() {
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (token) {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        store.dispatch({ type: Types.LOGOUT });
      } else {
        Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        store.dispatch({ type: Types.FETCH_USER_DETAILS });
      }
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <div className="App">
          <Router history={history}>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <AuthRoute exact path="/login" component={Login} />
                <AuthRoute exact path="/signup" component={Signup} />
              </Switch>
            </div>
          </Router>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
