import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    filter: FilterValuesType
    changeTaskTitle: (id: string, title: string, todolistId: string) => void
    changeTodolistTitle: (title: string, todolistId: string) => void
}

export function Todolist(props: PropsType) {

    const removeTodolist = () => props.removeTodolist(props.id)
    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);
    const addTaskToTodolist = (newTitle: string) => {
        props.addTask(newTitle, props.id)
    }
    //title: enablespan
    const changeTodolistTitleHandler = (title: string) => {
        //id: todolist
        props.changeTodolistTitle(title, props.id)
    }


    return <div>
        <EditableSpan title={props.title} changeTitle={changeTodolistTitleHandler}/>
        <IconButton aria-label="delete" onClick={removeTodolist}>
            <Delete/>
        </IconButton>
        <div>
            <AddItemForm addItem={addTaskToTodolist}/>
        </div>
        <ul style={{listStyle: "none", padding: '0'}}>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }
                    //title из editablespan
                    const changeTaskTitleHandler = (title: string) => {
                        //id: task, title: task, id: todolist
                        props.changeTaskTitle(t.id, title, props.id)
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}
                               style={{display: "flex", alignItems: "center"}}>
                        <Checkbox onChange={onChangeHandler} checked={t.isDone}/>
                        <EditableSpan title={t.title} changeTitle={changeTaskTitleHandler}/>
                        <IconButton aria-label="delete" onClick={onClickHandler}>
                            <Delete/>
                        </IconButton>
                    </li>
                })
            }
        </ul>
        <div>
            <Button
                style={{marginRight: '10px'}}
                variant={props.filter === 'all' ? "contained" : "outlined"}
                onClick={onAllClickHandler}>All
            </Button>
            <Button
                style={{marginRight: '10px'}}
                variant={props.filter === 'active' ? "contained" : "outlined"}
                onClick={onActiveClickHandler}>Active
            </Button>
            <Button
                variant={props.filter === 'completed' ? "contained" : "outlined"}
                onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
}


