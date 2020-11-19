export interface CollectionType {
  _id: string;
  tasks: Array<TaskObjType>;
}

export interface DocumentType {
  _id: string;
  tasks: Array<TaskObjType>;
  completed: Array<TaskObjType>;
}

export interface UserType {
  user_id: string;
  name: string;
  list: string;
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
