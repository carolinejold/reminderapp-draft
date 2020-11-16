export interface qsTypes {
  name: string | null;
  room: string | null;
}

export interface TaskObjType {
  user_id: string;
  message_id: string;
  name: string;
  room: string;
  task: string;
  date: string;
  time: string;
  completed: boolean;
}