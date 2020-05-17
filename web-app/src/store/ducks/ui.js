import { createReducer, createActions } from "reduxsauce";

export const { Types, Creators } = createActions({
  setErrors: ["errors"],
  clearErrors: [],
  loading: [],
  stopLoading: [],
});

const INITIAL_STATE = {
  loading: false,
  errors: {},
};

const setErrors = (state = INITIAL_STATE, { payload }) => ({
  ...state,
  loading: false,
  errors: payload,
});

const clearErrors = (state = INITIAL_STATE) => ({
  ...state,
  loading: false,
  errors: {},
});

const loading = (state = INITIAL_STATE) => ({
  ...state,
  loading: true,
});

const stopLoading = (state = INITIAL_STATE) => ({
  ...state,
  loading: false,
});

export default createReducer(INITIAL_STATE, {
  [Types.SET_ERRORS]: setErrors,
  [Types.CLEAR_ERRORS]: clearErrors,
  [Types.LOADING]: loading,
  [Types.STOP_LOADING]: stopLoading,
});
