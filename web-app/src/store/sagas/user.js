import { Types } from "../ducks/user";
import { takeEvery, call, put } from "redux-saga/effects";
import Axios from "axios";

function* login({ credentials }) {
  try {
    const { data } = yield call(Axios.post, "/login", credentials);

    sessionStorage.setItem("FBjwt", data.token);
    Axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    yield put({ type: Types.FETCH_USER_DETAILS });
  } catch (e) {
    //     dispatch({ type: SET_ERRORS, payload: data });
  }
}

function* fetchUserDetails() {
  const { data } = yield call(Axios.get, "/users");
  yield put({ type: Types.LOGIN_COMPLETE, payload: { ...data } });
  //     dispatch({ type: CLEAR_ERRORS });
  //     history.push("/");
}

export default function* root() {
  yield takeEvery(Types.LOGIN, login);
  yield takeEvery(Types.FETCH_USER_DETAILS, fetchUserDetails);
}
