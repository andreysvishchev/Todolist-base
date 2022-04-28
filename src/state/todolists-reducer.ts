import { FilterValuesType, TodolistType } from "../App";

export type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof AddTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof ChangeTodolistTitleAC>;
export type ChangeTodolistFilterActionType = ReturnType<typeof ChangeTodolistFilterAC>;

export type ActionsType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType;

export const todolistsReducer = (state: Array<TodolistType>, action: ActionsType): Array<TodolistType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id != action.todolistId);
    case "ADD-TODOLIST":
      return [{ id: action.todolistId, title: action.title, filter: "all" }, ...state];
    case "CHANGE-TODOLIST-TITLE": {
      const todolist = state.find((tl) => tl.id === action.todolistId);
      if (todolist) {
        todolist.title = action.title;
      }
      return [...state];
    }
    case "CHANGE-TODOLIST-FILTER": {
      const todolist = state.find((tl) => tl.id === action.todolistId);
      if (todolist) {
        todolist.filter = action.filter;
      }
      return [...state];
    }
    default:
      throw new Error("I don't understand this type");
  }
};

export const RemoveTodolistAC = (todolistId: string) => {
  return { type: "REMOVE-TODOLIST", todolistId } as const;
};
export const AddTodolistAC = (todolistId: string,title: string) => {
  return { type: "ADD-TODOLIST", title, todolistId } as const;
};
export const ChangeTodolistTitleAC = (todolistId: string, title: string) => {
  return { type: "CHANGE-TODOLIST-TITLE", title, todolistId } as const;
};
export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => {
  return { type: "CHANGE-TODOLIST-FILTER", filter, todolistId } as const;
};
