import React, {useCallback, useEffect} from "react";
import "./App.css";
import {Todolist} from "./Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC, fetchTodosThunk, FilterValuesType,
    RemoveTodolistAC, SetTodolistAC, SetTodolistActionType, TodolistDomainType
} from "./redux/todolists-reducer";
import {AddTaskAC, ChangeTaskStatusAC, changeTaskTitleAC, RemoveTaskAC} from "./redux/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppStateType} from "./redux/store";
import {TaskStatuses, TaskType} from "./api/todolists-api";
export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

function App() {

    let todolists = useSelector<AppStateType, Array<TodolistDomainType>>(state => state.todolists)
    let tasks = useSelector<AppStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch<AppDispatchType>()

    useEffect(() => {
        dispatch(fetchTodosThunk())
    },[])

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(RemoveTaskAC(id, todolistId));
    }, [])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(AddTaskAC(title, todolistId));
    }, [])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(ChangeTaskStatusAC(id, status, todolistId));
    }, [])

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(id, newTitle, todolistId));
    }, [])

    const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
        dispatch(ChangeTodolistFilterAC(todolistId, value));
    }, [])

    const removeTodolist = useCallback((id: string) => {
        let action = RemoveTodolistAC(id)
        dispatch(action)
    }, [])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(ChangeTodolistTitleAC(id, title));
    }, [])

    const addTodolist = useCallback((title: string) => {
        const action = AddTodolistAC(title)
        dispatch(action)
    }, [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{paddingTop: "20px", paddingBottom: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map((tl) => {

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
                                    />
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
