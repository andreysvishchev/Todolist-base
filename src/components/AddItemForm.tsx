import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';

import s from './AdditemForm.module.css'
import {TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {AddBox} from "@mui/icons-material";
import {useAppSelector} from "../app/store";
import {RequestStatusType} from "../app/app-reducer";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)


    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div className={s.wrap}>
        <TextField variant="outlined"
                   size="small"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
                   disabled={props.disabled}

        />
        <IconButton color="primary" onClick={addItem} disabled={props.disabled}
                    style={{maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}}>
            <AddBox fontSize="large"/>
        </IconButton>
    </div>
})
