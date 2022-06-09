import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "./todolists-reducer";
import {TasksStateType} from "../../app/App";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {AppStateType} from "../../app/store";
import {setAppErrorAC, setAppErrorActionType, setAppStatusAC, setAppStatusActionType} from "../../app/app-reducer";
import { AxiosError } from "axios";

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "FETCH-TASKS":
            return {...state, [action.todoId]: action.tasks}
        case "REMOVE-TASK":
            return {...state, [action.todolistID]: state[action.todolistID].filter((el) => el.id !== action.id),};
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.id ? {...t, ...action.model} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.id];
            return stateCopy;
        }
        case "SET-TODOLIST":
            const stateCopy = {...state}
            action.todolists.forEach(el => {
                stateCopy[el.id] = []
            })
            return stateCopy
        default:
            return state;
    }
};

// action
export const RemoveTaskAC = (todolistID: string, id: string) => {
    return {type: "REMOVE-TASK", id, todolistID} as const;
};
export const AddTaskAC = (task: TaskType) => {
    return {type: "ADD-TASK", task} as const;
};
export const updateTaskAC = (id: string, model: UpdateTaskModelType, todolistId: string) => {
    return {type: "UPDATE-TASK", id, model, todolistId} as const;
};
export const fetchTasksAC = (todoId: string, tasks: TaskType[]) => {
    return {type: 'FETCH-TASKS', todoId, tasks} as const
}

// thunk
export const fetchTasksTC = (todoId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todoId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(fetchTasksAC(todoId, tasks))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(RemoveTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                const newTask = res.data.data.item
                dispatch(AddTaskAC(newTask))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                dispatch(setAppErrorAC(res.data.messages.length ? res.data.messages[0] : 'Some error occurred'))
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((err: AxiosError)=> {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC('failed'))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppStateType) => {
        dispatch(setAppStatusAC('loading'))
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        if (task) {
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                status: task.status,
                deadline: task.deadline,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                ...domainModel
            }
            todolistsAPI.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    dispatch(updateTaskAC(taskId, apiModel, todolistId,));
                    dispatch(setAppStatusAC('succeeded'))
                })
        }
    }

// types
export type UpdateDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type ActionsType =
    | ReturnType<typeof RemoveTaskAC>
    | ReturnType<typeof AddTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof fetchTasksAC>
    | setAppStatusActionType
    | setAppErrorActionType
