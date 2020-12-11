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
