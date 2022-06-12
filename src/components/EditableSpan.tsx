import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {TextField} from '@mui/material'
import s from './EditableSpam.module.css'

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    disabled?: boolean
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        if(!props.disabled) {
            setEditMode(true);
            setTitle(props.value);
        }
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e:KeyboardEvent<HTMLInputElement>) => {
        if(e.charCode === 13) {
            setEditMode(false);
            props.onChange(title);
        }
    }

    return (
        editMode
            ? <TextField variant={editMode ? "standard" : "outlined"}
                         disabled={props.disabled}
                         size="small"
                         value={title}
                         onChange={changeTitle}
                         autoFocus
                         onKeyPress={onKeyPressHandler}
                         onBlur={activateViewMode}/>
            : <span onDoubleClick={activateEditMode}>{props.value}</span>
    )

})
