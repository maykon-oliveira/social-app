import { createReducer, createActions } from "reduxsauce";

export const { Types, Creators } = createActions({
  login: ["credentials"],
  loginComplete: ["user"],
  fetchUserDetails: [],
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

const loading = (state = INITIAL_STATE) => ({
  ...state,
  loading: true,
});

export default createReducer(INITIAL_STATE, {
  [Types.LOGIN]: loading,
  [Types.LOGIN_COMPLETE]: loginComplete,
});