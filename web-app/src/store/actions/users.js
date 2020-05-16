import { LOADING_UI, SET_USER, CLEAR_ERRORS, SET_ERRORS } from "../types";
import Axios from "axios";

export const loginUser = (user, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  Axios.post("/login", user)
    .then(({ data: { token } }) => token)
    .then((token) => {
      sessionStorage.setItem("FBjwt", token);
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(({ response: { data } }) => {
      dispatch({ type: SET_ERRORS, payload: data });
    });
};

export const getUserData = () => (dispatch) => {
  Axios.get("/users")
    .then(({ data }) => {
      dispatch({ type: SET_USER, payload: data });
    })
    .catch((e) => {
      console.log(e);
    });
};
