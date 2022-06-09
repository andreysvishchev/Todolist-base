import {useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppStateType} from "../../app/store";
import {
    ChangeTodolistFilterAC, createTodolistTC,
    fetchTodosTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType, updateTodolistTC
} from "./todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {addTaskTC, removeTaskTC, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";

import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";
import {Grid} from "@mui/material";
import Paper from "@mui/material/Paper";
import s from './../../app/App.module.css'

export const TodolistsList = () => {
    let todolists = useSelector<AppStateType, Array<TodolistDomainType>>(state => state.todolists)
    let tasks = useSelector<AppStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch<AppDispatchType>()

    useEffect(() => {
        dispatch(fetchTodosTC())
    }, [])
    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, id))
    }, [dispatch])
    const addTask = useCallback((todolistId: string, title: string,) => {
        dispatch(addTaskTC(todolistId, title))
    }, [dispatch])
    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, id, {status}))
    }, [dispatch])
    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, id, {title: newTitle}))
    }, [dispatch])
    const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
        dispatch(ChangeTodolistFilterAC(todolistId, value));
    }, [dispatch])
    const removeTodolist = useCallback((id: string) => {
        let thunk = removeTodolistTC(id)
        dispatch(thunk)
    }, [dispatch])
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(updateTodolistTC(id, title))
    }, [dispatch])
    const addTodolist = useCallback((title: string) => {
        const thunk = createTodolistTC(title)
        dispatch(thunk)
    }, [dispatch])

    return (
        <>
            <Grid container style={{paddingTop: "20px", paddingBottom: "20px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.length !== 0 ? todolists.map((tl) => {
                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: "10px", minWidth: "280px", maxWidth: "320px"}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasks[tl.id]}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                        entityStatus={tl.entityStatus}
                                    />
                                </Paper>
                            </Grid>
                        );
                    }) :
                    <div className={s.zero}>crate task</div>
                }
            </Grid>
        </>
    )
}