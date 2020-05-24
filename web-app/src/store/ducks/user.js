import { createReducer, createActions } from "reduxsauce";

export const TOKEN_KEY = "FBToken";

export const { Types, Creators } = createActions({
  login: ["credentials"],
  loginComplete: ["user"],
  loginFailure: ["user"],
  fetchUserDetails: [],
  signup: ["form"],
  logout: [],
  logoutComplete: [],
  uploadUserImage: ["form"],
  editProfile: ["profile"],
});

const INITIAL_STATE = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

const loginComplete = (state = INITIAL_STATE, { payload }) => ({
  ...state,
  ...payload,
  loading: false,
  authenticated: true,
});

const loginFailure = (state = INITIAL_STATE) => ({
  ...state,
  loading: false,
  authenticated: false,
});

const loading = (state = INITIAL_STATE) => ({
  ...state,
  loading: true,
});

const logoutComplete = (state = INITIAL_STATE) => INITIAL_STATE;

export default createReducer(INITIAL_STATE, {
  [Types.LOGIN]: loading,
  [Types.FETCH_USER_DETAILS]: loading,
  [Types.LOGIN_COMPLETE]: loginComplete,
  [Types.LOGIN_FAILURE]: loginFailure,
  [Types.SIGNUP]: loading,
  [Types.LOGOUT_COMPLETE]: logoutComplete,
  [Types.EDIT_PROFILE]: loading,
});
