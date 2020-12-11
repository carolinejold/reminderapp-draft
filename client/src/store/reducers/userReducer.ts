// list of users

import { Reducer } from "redux";
import { UserType, UserActions, SET_USER, CLEAR_USER } from "../../types/types";

const defaultUser: UserType = {
  user_id: "",
  name: "",
  list: "",
}; // default state 

const userReducer: Reducer<UserType, UserActions> = (
  state = defaultUser, // default state
  { type, payload }
) => {
  switch (type) {
    case SET_USER:
      return payload;
    case CLEAR_USER:
      return defaultUser;
    default:
      return state;
  }
};

export default userReducer;
