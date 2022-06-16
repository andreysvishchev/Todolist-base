import {authAPI} from "../api/todolists-api";
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";

const initialState: InitialStateType = {
    status: 'idle' as RequestStatusType,
    error: null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        default:
            return state
    }
}

// action
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setAppErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const
}

//thunk
export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
}


// types
export type ActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
type InitialStateType = {
    status: RequestStatusType
    error: string | null
}
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
