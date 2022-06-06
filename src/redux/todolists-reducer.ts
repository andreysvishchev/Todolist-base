import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {AppStateType} from "./store";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof AddTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof ChangeTodolistTitleAC>;
export type ChangeTodolistFilterActionType = ReturnType<typeof ChangeTodolistFilterAC>;
export type SetTodolistActionType = ReturnType<typeof SetTodolistAC>

export type ActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistActionType;

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.todolists.map((item)=> {
                return {...item, filter: "all" as FilterValuesType}
            })
        case "REMOVE-TODOLIST":
            return state.filter((tl) => tl.id != action.todolistId);
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el => el.id === action.todolistId ? {...el, title: action.title} : el)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(el => el.id === action.todolistId ? {...el, filter: action.filter} : el);
        default:
            return state
    }
};

export const RemoveTodolistAC = (todolistId: string) => {
    return {type: "REMOVE-TODOLIST", todolistId} as const;
};
export const AddTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title, todolistId: v1()} as const;
}
export const ChangeTodolistTitleAC = (todolistId: string, title: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", title, todolistId} as const;
};
export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => {
    return {type: "CHANGE-TODOLIST-FILTER", filter, todolistId} as const;
};
export const SetTodolistAC = (todolists: TodolistType[]) => {
    return {
        type: "SET-TODOLIST",
        todolists
    } as const
}

//thunk (принимает диспатч и стейт всего приложения)
export const fetchTodosThunk = () => {
    //сайд-эффект
   return (dispatch: Dispatch)=> {
       todolistsAPI.getTodolists()
           .then((res)=> {
               dispatch(SetTodolistAC(res.data))
           })
   }
   // thunk всегда диспатчится
}
