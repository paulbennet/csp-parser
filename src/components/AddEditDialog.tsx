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
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { AutoCompleteTextField } from "./AutoComplete";

type DialogProps = {
    onClose: Function,
    isOpen: boolean,
    directiveList: string[],
    addSourcesToDirective: Function,
    dir: string,
    src: string[],
    suggestionList: string[],
    addSuggestion: Function
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AddEditDialog: React.FC<DialogProps> = ({
    onClose,
    isOpen,
    directiveList,
    addSourcesToDirective,
    dir,
    src,
    suggestionList,
    addSuggestion }) => {
    const [directive, setDirective] = useState<string>("");
    const [sources, setSources] = useState<string[]>([]);

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setDirective("");
            setSources([]);
        } else {
            setDirective(dir || directiveList[0]);
            setSources(src || []);
        }
    }, [isOpen, directiveList])

    const handleAdd = () => {
        addSourcesToDirective(directive, sources)
    }

    const handleAddSources = (source: string) => {
        let src = [...sources];
        src.push(source);

        src = Array.from(new Set(src));
        setSources(src);
        addSuggestion(source);
    };

    const handleDirectiveChange = (event: SelectChangeEvent<typeof directive>) => {
        const {
            target: { value },
        } = event;
        setDirective(value);
    };

    const handleDeleteSource = (sourceString: string) => {
        let src = [...sources];

        src = src.filter((source) => {
            return source !== sourceString;
        });

        src = Array.from(new Set(src));
        setSources(src);
    }

    return (
        <div>
            <Dialog
                scroll={"paper"}
                open={isOpen}
                TransitionComponent={Transition}
                fullWidth={true}
                maxWidth={"md"}
                onClose={handleClose}
            >
                <DialogTitle>{"Add a Directive"}</DialogTitle>
                <DialogContent dividers={true}>
                    <Container sx={{ padding: "5px" }}>
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                {
                                    !dir && <FormControl sx={{ minWidth: 180, maxWidth: 180 }} size="small">
                                        <InputLabel>Directives</InputLabel>
                                        <Select
                                            inputProps={{ readOnly: sources.length > 0 }}
                                            value={directive}
                                            onChange={handleDirectiveChange}
                                            input={<OutlinedInput label="Directive" />}
                                        >
                                            {directiveList.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                }
                                {
                                    dir && <TextField
                                        size="small"
                                        fullWidth
                                        id="sources-textarea"
                                        label="Sources"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        value={directive}
                                    />
                                }
                            </Grid>
                            <Grid item xs={9}>
                                <AutoCompleteTextField directive={directive} handleAddSources={handleAddSources} suggestionList={suggestionList} />
                                <List sx={{
                                    width: '100%',
                                    bgcolor: 'background.paper',
                                    position: 'relative',
                                    overflow: 'auto',
                                    marginBlockStart: "10px",
                                    maxHeight: 300,
                                    ".MuiListItemSecondaryAction-root": {
                                        paddingRight: "15px"
                                    }
                                }}>
                                    {
                                        sources.map((source) => {
                                            return <ListItem
                                                key={source}
                                                disablePadding
                                                disableGutters
                                                secondaryAction={
                                                    <IconButton edge="end" onClick={(_event) => {
                                                        handleDeleteSource(source)
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemButton>
                                                    <ListItemText primary={source} />
                                                </ListItemButton>
                                            </ListItem>
                                        })
                                    }
                                </List>
                            </Grid>
                        </Grid>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={(directive.length === 0)} onClick={handleAdd}>Okay</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};