import {AnyAction, applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {appReducer} from "./app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppStateType = ReturnType<typeof rootReducer>
export type AppDispatchType =  ThunkDispatch<AppStateType, any, AnyAction>
export const useAppSelector: TypedUseSelectorHook<AppStateType> = useSelector

