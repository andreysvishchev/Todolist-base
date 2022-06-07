import React from "react";
import {AppBar, Button, Container, IconButton, Toolbar} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TaskType} from "../api/todolists-api";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";

export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

function App() {

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
               <TodolistsList/>
            </Container>
        </div>
    );
}



export default App;
