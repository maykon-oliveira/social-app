import { Types as UserTypes } from "../ducks/user";
import { Types as UITypes } from "../ducks/ui";
import { takeEvery, call, put } from "redux-saga/effects";
import Axios from "axios";
import history from "../../utils/history";

// Login
function* login({ credentials }) {
  try {
    const { data } = yield call(Axios.post, "/login", credentials);

    sessionStorage.setItem("FBjwt", data.token);
    Axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    yield put({ type: UserTypes.FETCH_USER_DETAILS });
  } catch ({ response }) {
    yield put({ type: UserTypes.LOGIN_FAILURE });
    yield put({ type: UITypes.SET_ERRORS, payload: response.data });
  }
}

function* fetchUserDetails() {
  const { data } = yield call(Axios.get, "/users");
  yield put({ type: UserTypes.LOGIN_COMPLETE, payload: { ...data } });
  yield put({ type: UITypes.CLEAR_ERRORS });
  history.push("/");
}

// Signup
function* signup({ form }) {
  try {
    const { data } = yield call(Axios.post, "/signup", form);

    sessionStorage.setItem("FBjwt", data.token);
    Axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    yield put({ type: UserTypes.FETCH_USER_DETAILS });
  } catch ({ response }) {
    yield put({ type: UserTypes.LOGIN_FAILURE });
    yield put({ type: UITypes.SET_ERRORS, payload: response.data });
  }
}

function* logout() {
  sessionStorage.removeItem("FBjwt");
  delete Axios.defaults.headers.common["Authorization"];
  history.push("/login");
  yield put({ type: UserTypes.LOGOUT_COMPLETE });
}

export default function* root() {
  yield takeEvery(UserTypes.LOGIN, login);
  yield takeEvery(UserTypes.FETCH_USER_DETAILS, fetchUserDetails);
  yield takeEvery(UserTypes.SIGNUP, signup);
  yield takeEvery(UserTypes.LOGOUT, logout);
}
