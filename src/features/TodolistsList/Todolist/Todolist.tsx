import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan';

import s from '../../../app/App.module.css'
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {FilterValuesType} from "../todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {fetchTasksTC} from "../tasks-reducer";
import {AppDispatchType, AppStateType} from "../../../app/store";
import Task from "./Task/Task";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {RequestStatusType} from "../../../app/app-reducer";
import {Navigate, useNavigate} from "react-router-dom";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    entityStatus: RequestStatusType
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo((props: PropsType) => {

    const dispatch = useDispatch<AppDispatchType>()


    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [])

    const addTask = useCallback((title: string) => {
            props.addTask(props.id, title);
        },
        [props.addTask, props.id])
    const removeTodolist = useCallback(() => {
            props.removeTodolist(props.id);
        },
        [props.id])
    const changeTodolistTitle = useCallback((title: string) => {
            props.changeTodolistTitle(props.id, title);
        },
        [props.id, props.title])

    const onAllClickHandler = () => props.changeFilter(props.id, "all");
    const onActiveClickHandler = () => props.changeFilter(props.id, "active");
    const onCompletedClickHandler = () => props.changeFilter(props.id, "completed");

    let tasksForTodolist = props.tasks;

    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.Completed);
    }

    /*   if (!isLoggedIn) {
           return <Navigate to={'/login'}/>
       }*/

    return <div>
        <h3 className={s.title}><EditableSpan value={props.title} onChange={changeTodolistTitle}
                                              disabled={props.entityStatus === 'loading'}/>
            <IconButton onClick={removeTodolist} disabled={props.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>
        <div style={{marginTop: '15px'}}>
            {tasksForTodolist.map(t => {
                return <Task key={t.id}
                             task={t}
                             todolistId={props.id}
                             removeTask={props.removeTask}
                             changeTaskStatus={props.changeTaskStatus}
                             changeTaskTitle={props.changeTaskTitle}
                />
            })
            }
        </div>
        <div className={s.buttons}>
            <Button variant={props.filter === 'all' ? 'contained' : 'text'}
                    size="medium"
                    onClick={onAllClickHandler}>All</Button>
            <Button variant={props.filter === 'active' ? 'contained' : 'text'}
                    size="medium"
                    onClick={onActiveClickHandler}>Active</Button>
            <Button variant={props.filter === 'completed' ? 'contained' : 'text'}
                    size="medium"
                    onClick={onCompletedClickHandler}>Completed</Button>
        </div>
    </div>
})