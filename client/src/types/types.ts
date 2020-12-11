import rootReducer from "../store/reducers";

export interface qsTypes {
  name: string | null;
  list: string | null;
}

export interface TaskObjType {
  user_id: string;
  message_id: string;
  name: string;
  list: string;
  task: string;
  date: string;
  time: string;
  completed: boolean;
}

export interface UserType {
  user_id: string;
  name: string;
  list: string;
}

export type Socket = SocketIOClient.Socket;
export type DefaultSocket = {
  id: string | undefined;
  connected: boolean;
  disconnected: boolean;
};

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
export const ADD_CREATED_LIST = "ADD_CREATED_LIST";
export const REMOVE_LIST = "REMOVE_LIST";
export const SET_CREATED_LISTS = "SET_CREATED_LISTS";
export const SET_CURRENT_LIST = "SET_CURRENT_LIST";
export const SET_ITEMS = "SET_ITEMS";
export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const CLEAR_LISTS = "CLEAR_LISTS";
export const NEW_SOCKET = "NEW_SOCKET";
export const DISCONNECT = "DISCONNECT";

export interface SetUser {
  type: typeof SET_USER;
  payload: User;
}

export interface ClearUser {
  type: typeof CLEAR_USER;
  payload: User;
}

export interface AddCreatedList {
  type: typeof ADD_CREATED_LIST;
  payload: List[];
}

export interface RemoveList {
  type: typeof REMOVE_LIST;
  payload: List[];
}

export interface SetCreatedLists {
  type: typeof SET_CREATED_LISTS;
  payload: List[];
}

export interface SetItems {
  type: typeof SET_ITEMS;
  payload: Item[];
}

export interface AddItem {
  type: typeof ADD_ITEM;
  payload: Item[];
}

export interface UpdateItem {
  type: typeof UPDATE_ITEM;
  payload: Item[];
}

export interface RemoveItem {
  type: typeof REMOVE_ITEM;
  payload: Item[];
}

export type NewSocket = {
  type: typeof NEW_SOCKET;
  payload: Socket;
};

export type DisconnectSocket = {
  type: typeof DISCONNECT;
  payload: DefaultSocket;
};

export interface SetCurrentList {
  type: typeof SET_CURRENT_LIST;
  payload: CurrentList;
}

export type UserActions = SetUser | ClearUser;

export type ListActions = AddCreatedList | SetCreatedLists | RemoveList;

export type CurrentListActions = SetCurrentList;

export type ItemActions = AddItem | SetItems | UpdateItem | RemoveItem;

export type SocketActions = NewSocket | DisconnectSocket;

export type RootState = ReturnType<typeof rootReducer>;
