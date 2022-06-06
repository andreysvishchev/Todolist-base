import React, {memo, useCallback} from 'react';
import {AddItemForm} from './components/AddItemForm';
import {EditableSpan} from './components/EditableSpan';
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import s from './App.module.css'
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {FilterValuesType} from "./redux/todolists-reducer";
import Task from "./Task";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo((props: PropsType) => {

    const addTask = useCallback((title: string) => {
            props.addTask(title, props.id);
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

    return <div>
        <h3 className={s.title}><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {tasksForTodolist.map(t => {
                    return <Task task={t}
                                 todolistId={props.id}
                                 removeTask={props.removeTask}
                                 changeTaskStatus={props.changeTaskStatus}
                                 changeTaskTitle={props.changeTaskTitle}/>
                })
            }
        </div>
        <div className={s.buttons}>
            <Button variant={props.filter === 'all' ? 'contained' : 'text'}
                    style={{marginRight: '5px', marginLeft: '10px'}}
                    size="medium"
                    onClick={onAllClickHandler}>All</Button>
            <Button variant={props.filter === 'active' ? 'contained' : 'text'}
                    style={{marginRight: '5px', marginLeft: '10px'}}
                    size="medium"
                    onClick={onActiveClickHandler}>Active</Button>
            <Button variant={props.filter === 'completed' ? 'contained' : 'text'}
                    style={{marginRight: '5px', marginLeft: '10px'}}
                    size="medium"
                    onClick={onCompletedClickHandler}>Completed</Button>
        </div>
    </div>
})