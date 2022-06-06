import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "./todolists-reducer";
import {TasksStateType} from "../App";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

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
    | RemoveTodolistActionType
    | SetTodolistActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOLIST":
            const stateCopy = {...state}
            action.todolists.forEach(el=>{
                stateCopy[el.id] = []
            })
            return stateCopy
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].filter((el) => el.id !== action.id),
            };
        case "ADD-TASK":
            const newTask = {
                id: v1(), title: action.title, status: TaskStatuses.New,
                todoListId: action.todolistID, description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            };
            return {...state, [action.todolistID]: [newTask, ...state[action.todolistID]]}
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((el) => (el.id === action.id ? {
                    ...el,
                    status: action.status
                } : el)),
            };
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((el) => (el.id === action.id ? {
                    ...el,
                    title: action.newTitle
                } : el)),
            };
        case "ADD-TODOLIST": {
            return {...state, [action.todolistId]: []}
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.todolistId];
            return stateCopy;
        }
        default:
            return state;
    }
};

export const RemoveTaskAC = (id: string, todolistID: string) => {
    return {type: "REMOVE-TASK", id, todolistID} as const;
};

export const AddTaskAC = (title: string, todolistID: string) => {
    return {type: "ADD-TASK", title, todolistID} as const;
};

export const ChangeTaskStatusAC = (id: string, status: TaskStatuses, todolistId: string) => {
    return {type: "CHANGE-TASK-STATUS", id, status, todolistId} as const;
};

export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string) => {
    return {type: "CHANGE-TASK-TITLE", id, newTitle, todolistId} as const;
};
