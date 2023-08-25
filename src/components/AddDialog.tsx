import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Grid from '@mui/material/Grid';
import { Container } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type DialogProps = {
    onClose: Function,
    isOpen: boolean,
    directiveList: string[],
    addDirective: Function
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AddDialog: React.FC<DialogProps> = ({ onClose, isOpen, directiveList, addDirective }) => {
    const [directive, setDirective] = useState("");
    const [sources, setSources] = useState("");

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setDirective("");
            setSources("");
        }
    }, [isOpen, directiveList])

    const handleAdd = () => {
        addDirective(directive, sources)
    }

    const handleDirectiveChange = (event: SelectChangeEvent) => {
        setDirective(event.target.value);
    };

    const handleSourcesChange = (event) => {
        setSources(event.target.value);
    };

    return (
        <div>
            <Dialog
                open={isOpen}
                TransitionComponent={Transition}
                fullWidth={true}
                maxWidth={"md"}
                onClose={handleClose}
            >
                <DialogTitle>{"Add a Policy"}</DialogTitle>
                <DialogContent>
                    <Container sx={{ padding: "5px" }}>
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <FormControl sx={{ minWidth: 180, maxWidth: 180 }} size="small">
                                    <Select
                                        value={directive}
                                        onChange={handleDirectiveChange}
                                    >
                                        {
                                            directiveList.map((directive) => {
                                                return <MenuItem key={directive} value={directive}>{directive}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="sources-textarea"
                                    label="Sources"
                                    value={sources}
                                    onChange={handleSourcesChange}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={sources.length === 0} onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};