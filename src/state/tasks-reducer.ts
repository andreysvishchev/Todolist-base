import { TasksStateType } from "../App";
import { v1 } from "uuid";
import { AddTodolistActionType, RemoveTodolistActionType } from "./todolists-reducer";

type RemoveTaskActionType = ReturnType<typeof RemoveTaskAC>;

type AddTaskActionType = ReturnType<typeof AddTaskAC>;

type changeStatusActionType = ReturnType<typeof ChangeTaskStatusAC>;

type changeTaskTitleAction = ReturnType<typeof changeTaskTitleAC>;

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | changeStatusActionType
  | changeTaskTitleAction
  | AddTodolistActionType
  | RemoveTodolistActionType;

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].filter((el) => el.id !== action.id),
      };
    case "ADD-TASK":

      const newTask = { id: v1(), title: action.title, isDone: false };
       return {...state,[ action.todolistID]: [newTask, ...state[action.todolistID]]}
    case "CHANGE-TASK-STATUS":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((el) => (el.id === action.id ? { ...el, isDone: action.isDone } : el)),
      };
    case "CHANGE-TASK-TITLE":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((el) => (el.id === action.id ? { ...el, title: action.newTitle } : el)),
      };
    case "ADD-TODOLIST": {
      return {...state, [action.todolistId]: []}
    }

    case "REMOVE-TODOLIST": {
      const stateCopy = { ...state };
      delete stateCopy[action.todolistId];
      return stateCopy;
    }

    default:
      return state;
  }
};

export const RemoveTaskAC = (id: string, todolistID: string) => {
  return { type: "REMOVE-TASK", id, todolistID } as const;
};

export const AddTaskAC = (title: string, todolistID: string) => {
  return { type: "ADD-TASK", title, todolistID } as const;
};

export const ChangeTaskStatusAC = (id: string, isDone: boolean, todolistId: string) => {
  return { type: "CHANGE-TASK-STATUS", id, isDone, todolistId } as const;
};

export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string) => {
  return { type: "CHANGE-TASK-TITLE", id, newTitle, todolistId } as const;
};
