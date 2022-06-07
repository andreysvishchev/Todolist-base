import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.todolists.map(item =>  ({...item, filter: "all" as FilterValuesType}))
        case "REMOVE-TODOLIST":
            return state.filter((tl) => tl.id != action.id);
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el);
        default:
            return state
    }
};

// action
export const RemoveTodolistAC = (id: string) => {
    return {type: "REMOVE-TODOLIST", id} as const;
};
export const AddTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const;
}
export const ChangeTodolistTitleAC = (id: string, title: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", title, id} as const;
};
export const ChangeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: "CHANGE-TODOLIST-FILTER", filter, id} as const;
};
export const SetTodolistAC = (todolists: TodolistType[]) => {
    return {type: "SET-TODOLIST", todolists} as const
}

// thunk
export const fetchTodosTC = () => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(SetTodolistAC(res.data))
        })
}
export const removeTodolistTC = (id: string) => (dispatch: Dispatch<ActionsType>)=> {
    todolistsAPI.deleteTodolist(id)
        .then((res)=> {
            dispatch(RemoveTodolistAC(id))
        })
}
export const createTodolistTC = (title: string)=> (dispatch: Dispatch<ActionsType>)=> {
    todolistsAPI.createTodolist(title)
        .then((res)=> {
            dispatch(AddTodolistAC(res.data.data.item))
        })

}
export const updateTodolistTC = (id: string, title: string)=> (dispatch: Dispatch<ActionsType>)=> {
    todolistsAPI.updateTodolist(id, title)
        .then((res)=> {
            dispatch(ChangeTodolistTitleAC(id, title));
        })
}

//types
export type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof ChangeTodolistTitleAC>
    | ReturnType<typeof ChangeTodolistFilterAC>
    | ReturnType<typeof SetTodolistAC>
export type AddTodolistActionType = ReturnType<typeof AddTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>
export type SetTodolistActionType = ReturnType<typeof SetTodolistAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
