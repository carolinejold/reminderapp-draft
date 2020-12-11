import {
    // Socket,
    UserType,
    // CurrentList,
    UserActions,
    // SocketActions,
    // CurrentListActions,
    // ItemActions,
    // NEW_SOCKET,
    // DISCONNECT,
    SET_USER,
    // ADD_CREATED_LIST,
    // REMOVE_LIST,
    // SET_CREATED_LISTS,
    // SET_CURRENT_LIST,
    // ADD_ITEM,
    // SET_ITEMS,
    // REMOVE_ITEM,
    // UPDATE_ITEM,
    // ListActions,
    // List,
    // Item,
  } from '../types/types';

  export const setUser = (user: UserType): UserActions => ({
    type: SET_USER,
    payload: user,
  });