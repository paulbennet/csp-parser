import React, { useCallback, useEffect, useRef, useState } from "react";
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

type Props = {
    callback: Function
};

export const ImportPolicy: React.FC<Props> = ({ callback }) => {

    const [text, setText] = useState("");

    const handleOnAdd = () => {
        callback(undefined, "add-policy")
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            callback(text);
            setText("");
        }, 500)

        return () => {
            clearTimeout(timer);
        }
    }, [text]);

    const handleOnChange = (event: { preventDefault: () => void; target: { value: any; }; }) => {
        setText(event.target.value);
    };

    return (
        <Grid container>
            <Grid item xs={1}>
                <Tooltip title="Add CSP">
                    <Fab color="primary">
                        <AddIcon onClick={handleOnAdd} />
                    </Fab>
                </Tooltip>
            </Grid>
            <Grid item xs={11} sx={{ paddingLeft: "12px" }}>
                <TextField
                    autoFocus={true}
                    fullWidth
                    id="import-textarea"
                    label="Import CSP"
                    value={text}
                    placeholder="default-src 'self';...."
                    onChange={handleOnChange}
                />
            </Grid>
        </Grid>
    );
};