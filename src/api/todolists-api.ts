import axios, { AxiosResponse } from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'e7389ced-4c78-445b-8036-e7450704056b'
    }
})

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>('todo-lists', {title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(id: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`todo-lists/${id}`, {title});
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`, {title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}

// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}


export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}





/*   useEffect(() => {
       todolistsAPI.getTodolists()
           .then((response) => {
               response.data

           })
   }, [])

   useEffect(() => {
       const title = 'react'
       todolistsAPI.createTodolist(title)
           .then((response) => {
               response.data
           })
   }, [])

   useEffect(() => {
       const id = 'd123123'
       todolistsAPI.deleteTodolist(id)
           .then((response) => {
               response.data
           })
   }, [])

   useEffect(() => {
       const id = 'd123123'
       const title = 'react'
       todolistsAPI.updateTodolist(id, title)
           .then((response) => {
               response.data
           })
   }, [])

   useEffect(() => {
       const todolistId = '';
       todolistsAPI.getTasks(todolistId)
           .then((res) => {
               res.data
           })
   }, [])

   useEffect(() => {
       const todolistId = '';
       const taskId = '';
       todolistsAPI.deleteTasks(todolistId, taskId)
           .then((res) => {
               res.data
           })
   }, [])

   useEffect(() => {
       const todolistId = '';
       const taskTitle = '';
       todolistsAPI.createTask(todolistId, taskTitle)
           .then((res) => {
               res.data
           })
   }, [])

   useEffect(() => {
       const todolistId = '';
       const taskId = '';
       todolistsAPI.updateTasks(todolistId, taskId, {
           title: 'string',
           description: 'string',
           status: 1,
           priority: 1,
           startDate: 'string',
           deadline: 'string',
       })
           .then((res) => {
               res.data
           })
   }, [])

*/