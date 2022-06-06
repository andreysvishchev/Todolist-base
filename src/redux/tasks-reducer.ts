import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "./todolists-reducer";
import {TasksStateType} from "../App";
import {TaskStatuses, TaskType, todolistsAPI} from "../api/todolists-api";
import {Dispatch} from "redux";

type RemoveTaskActionType = ReturnType<typeof RemoveTaskAC>;

type AddTaskActionType = ReturnType<typeof AddTaskAC>;

type changeStatusActionType = ReturnType<typeof ChangeTaskStatusAC>;

type changeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;

type fetchTasksActionType = ReturnType<typeof fetchTasksAC>;

type ActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | changeStatusActionType
    | changeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | fetchTasksActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOLIST":
            const stateCopy = {...state}
            action.todolists.forEach(el => {
                stateCopy[el.id] = []
            })
            return stateCopy
        case "FETCH-TASKS":
            return {...state, [action.todoId]: action.tasks}
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].filter((el) => el.id !== action.id),
            };
        case "ADD-TASK": {
            let newTask = action.task
            const stateCopy = {...state}
            const tasks = stateCopy[newTask.todoListId]
            const newTasks = [newTask, ...tasks]
            stateCopy[newTask.todoListId] = newTasks
            return stateCopy
        }

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

export const RemoveTaskAC = (todolistID: string, id: string ) => {
    return {type: "REMOVE-TASK", id, todolistID} as const;
};

export const AddTaskAC = (task: TaskType) => {
    return {type: "ADD-TASK", task} as const;
};

export const ChangeTaskStatusAC = (id: string, status: TaskStatuses, todolistId: string) => {
    return {type: "CHANGE-TASK-STATUS", id, status, todolistId} as const;
};

export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string) => {
    return {type: "CHANGE-TASK-TITLE", id, newTitle, todolistId} as const;
};

export const fetchTasksAC = (todoId: string, tasks: TaskType[]) => {
    return {type: 'FETCH-TASKS', todoId, tasks} as const
}

export const fetchTasksTC = (todoId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todoId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(fetchTasksAC(todoId, tasks))
            })
    }
}

export const removeTaskTC = (todolistId: string, taskId: string)=> (dispatch: Dispatch)=> {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res)=> {
            dispatch(RemoveTaskAC(todolistId, taskId))
        })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            const newTask = res.data.data.item
            dispatch(AddTaskAC(newTask))
        })
}
