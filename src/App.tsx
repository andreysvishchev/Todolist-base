import React from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC
} from "./redux/todolists-reducer";
import {AddTaskAC, ChangeTaskStatusAC, changeTaskTitleAC, RemoveTaskAC} from "./redux/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./redux/store";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

function App() {
    let todolists = useSelector<AppStateType, Array<TodolistType>>(state => state.todolists)
    let tasks = useSelector<AppStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    function removeTask(id: string, todolistId: string) {
        dispatch(RemoveTaskAC(id, todolistId));
    }

    function addTask(title: string, todolistId: string) {
        dispatch(AddTaskAC(title, todolistId));
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        dispatch(ChangeTaskStatusAC(id, isDone, todolistId));
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        dispatch(changeTaskTitleAC(id, newTitle, todolistId));
    }

    function changeFilter(todolistId: string, value: FilterValuesType) {
        dispatch(ChangeTodolistFilterAC(todolistId, value));
    }

    function removeTodolist(id: string) {
        let action = RemoveTodolistAC(id)
        dispatch(action)
    }

    function changeTodolistTitle(id: string, title: string) {
        dispatch(ChangeTodolistTitleAC(id, title));
    }

    function addTodolist(title: string) {
        const action = AddTodolistAC(title)
        dispatch(action)
    }

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
                        let allTodolistTasks = tasks[tl.id];
                        let tasksForTodolist = allTodolistTasks;

                        if (tl.filter === "active") {
                            tasksForTodolist = allTodolistTasks.filter((t) => !t.isDone);
                        }
                        if (tl.filter === "completed") {
                            tasksForTodolist = allTodolistTasks.filter((t) => t.isDone);
                        }

                        return (
                            <Grid item>
                                <Paper style={{padding: "10px", minWidth: "280px", maxWidth: "320px"}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
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
