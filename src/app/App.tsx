import React from "react";


import {TaskType} from "../api/todolists-api";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";

import {useSelector} from "react-redux";
import {AppStateType, useAppSelector} from "./store";
import {RequestStatusType} from "./app-reducer";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

function App() {

    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                       <Menu open={false}/>
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <div style={{minHeight: '5px'}}>
                {status === 'loading' && <LinearProgress/>}
            </div>

            <Container fixed>
               <TodolistsList/>
            </Container>
        </div>
    );
}



export default App;
