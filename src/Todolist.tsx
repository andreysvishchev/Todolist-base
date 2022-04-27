import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './components/AddItemForm';
import {EditableSpan} from './components/EditableSpan';
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import s from './App.module.css'


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
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export function Todolist(props: PropsType) {

    const addTask = (title: string) => {
        props.addTask(title, props.id);
    }
    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title);
    }
    const onAllClickHandler = () => props.changeFilter(props.id, "all");
    const onActiveClickHandler = () => props.changeFilter(props.id, "active");
    const onCompletedClickHandler = () => props.changeFilter(props.id, "completed");

    return <div>
        <h3 className={s.title}><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id);
                    }

                    return <div key={t.id} className={s.task}>
                        <Checkbox checked={t.isDone} style={{padding: '2px', marginRight: '10px'}} color="primary"
                                  onChange={onChangeHandler}/>
                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton onClick={onClickHandler} style={{padding: '2px', marginLeft: '20px'}}>
                            <Delete/>
                        </IconButton>
                    </div>
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
}


