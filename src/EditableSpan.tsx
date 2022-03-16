import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    title: string
    changeTitle: (title: string) => void
}


export const EditableSpan = (props: EditableSpanType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState(props.title)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onEditMode = () => {
        setEditMode(true)
    }

    const offEdiMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }

    return (
        editMode
// mu
            ? <TextField id="standard-basic"
                         label=""
                         variant="standard"
                         size={"small"}
                         onChange={onChangeHandler}
                         onBlur={offEdiMode}
                         value={title}
                         autoFocus/>
            /* <input type="text" onChange={onChangeHandler} onBlur={offEdiMode} value={title} autoFocus/>*/
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
};

