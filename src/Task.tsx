import React, {ChangeEvent, useCallback} from 'react';
import {TaskStatuses, TaskType} from "./api/todolists-api";
import s from "./App.module.css";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./components/EditableSpan";
import {Delete} from "@material-ui/icons";


type PropsType = {
    task: TaskType
    todolistId: string
    removeTask: (taskId: string, todolistId: string)=> void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string)=> void
    changeTaskTitle: (taskId: string, newValue: string, todolistId: string)=> void
}

const Task: React.FC <PropsType>  = React.memo((props) => {

    const {
        task,
        todolistId,
        removeTask,
        changeTaskStatus,
        changeTaskTitle,
    } = props

    const onClickHandler = useCallback(() => removeTask(task.id, todolistId), [task.id, todolistId])
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        changeTaskStatus(task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, todolistId);
    }
    const onTitleChangeHandler = (newValue: string) => {
        changeTaskTitle(task.id, newValue, todolistId);
    }

    return (
        <div key={task.id} className={s.task}>
            <Checkbox checked={task.status === TaskStatuses.Completed} style={{padding: '2px', marginRight: '10px'}}
                      color="primary"
                      onChange={onChangeHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler} style={{padding: '2px', marginLeft: '20px'}}>
                <Delete/>
            </IconButton>
        </div>
    )
})

export default Task;