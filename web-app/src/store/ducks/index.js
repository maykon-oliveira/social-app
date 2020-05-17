import { combineReducers } from "redux";

import user from "./user";
import data from "./data";
import ui from "./ui";

export default combineReducers({
  user,
  data,
  ui,
});
