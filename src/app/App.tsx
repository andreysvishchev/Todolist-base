import React, {useEffect} from "react";


import {TaskType} from "../api/todolists-api";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";

import {useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppStateType, useAppSelector} from "./store";
import {initializeAppTC, RequestStatusType, setAppInitializedActionType} from "./app-reducer";
import {AppBar} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {loginTC, logoutTC} from "../features/Login/auth-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
};

function App() {

    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch<AppDispatchType>()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return (
            <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
                <CircularProgress/>
            </div>
        )
    }

    const logoutHandler = () => {
        dispatch(logoutTC())
    }


    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu open={false}/>
                    </IconButton>
                    {
                        isLoggedIn &&
                        <Button onClick={logoutHandler} color="inherit">LogOut</Button>

                    }

                </Toolbar>

            </AppBar>

            <div style={{minHeight: '5px'}}>
                {status === 'loading' && <LinearProgress/>}
            </div>

            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path="/404" element={<h1 style={{textAlign: "center"}}>404: PAGE NOT FOUND</h1>}/>
                    <Route path="*" element={<Navigate to='/404'/>}/>
                </Routes>
            </Container>
        </div>
    );
}


export default App;
