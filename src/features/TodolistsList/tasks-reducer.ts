import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "./todolists-reducer";
import {TasksStateType} from "../../app/App";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {AppStateType} from "../../app/store";

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
            return {...state, [action.todolistId]: state[action.todolistId].map(t=> t.id === action.id ? {...t, ...action.model} : t)}
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.id];
            return stateCopy;
        }
        case "SET-TODOLIST":
            const stateCopy = {...state}
            action.todolists.forEach(el => {stateCopy[el.id] = []})
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
        todolistsAPI.getTasks(todoId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(fetchTasksAC(todoId, tasks))
            })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(RemoveTaskAC(todolistId, taskId))
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            const newTask = res.data.data.item
            dispatch(AddTaskAC(newTask))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppStateType) => {

        const state = getState()
        const task = state.tasks[todolistId].find(t=> t.id === taskId)

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