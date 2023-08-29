import React, { useEffect, useState } from "react";
import Fab from '@mui/material/Fab';
import IosShareIcon from '@mui/icons-material/IosShare';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputAdornment from '@mui/material/InputAdornment';


type ExportPolicyProps = {
    directives: Object,
    policyCount: number
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const ExportPolicy: React.FC<ExportPolicyProps> = ({ directives, policyCount }) => {

    const [isOpen, setOpen] = useState<boolean>(false);
    const [json, setJson] = useState<string>("");
    const [url, setURL] = useState<string>("");
    const [policyString, setPolicyString] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");

    const constructPolicyString = () => {
        let policyString = "";

        Object.keys(directives)
            .forEach((directive) => {
                if (directives[directive].length > 0) {
                    const policy = `${directive} ${directives[directive].join(" ")}; `;
                    policyString = policyString.concat(policy);
                }
            })

        setPolicyString(policyString);
        setURL(`${window.location.origin}?key=${window.btoa(policyString)}`)
    };

    useEffect(() => {
        if (isOpen) {
            setJson(JSON.stringify(directives));
            constructPolicyString();
        }
    }, [isOpen, directives])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const onSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleOnClick = (type: string) => {
        let content = ""
        if (type === "policyString") {
            content = policyString;
        } else if (type === "json") {
            content = json;
        } else {
            content = url;
        }

        navigator.clipboard.writeText(content)
            .then(() => {
                setSnackbarMessage("Copied to clipboard!");
                setSnackbarOpen(true);
            })
            .catch((_err) => {
                setSnackbarMessage("Error!");
                setSnackbarOpen(true);
            });
    };

    return <>
        <Fab color="primary" onClick={handleOpen} disabled={policyCount === 0}>
            <IosShareIcon />
        </Fab>
        <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth={"md"}
            onClose={handleClose}
        >
            <DialogTitle>{"Export Policy"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <DialogContentText>Policy String</DialogContentText>
                        <FormControl fullWidth>
                            <FilledInput
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        onClick={() => {
                                            handleOnClick("policyString");
                                        }} color="primary" sx={{ p: '10px' }} aria-label="directions">
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>}
                                readOnly
                                value={policyString} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <DialogContentText>JSON</DialogContentText>
                        <FormControl fullWidth>
                            <FilledInput
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        onClick={() => {
                                            handleOnClick("json");
                                        }} color="primary" sx={{ p: '10px' }} aria-label="directions">
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>}
                                readOnly
                                value={json} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <DialogContentText>URL</DialogContentText>
                        <FormControl fullWidth>
                            <FilledInput
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        onClick={() => {
                                            handleOnClick("url");
                                        }}
                                        color="primary" sx={{ p: '10px' }} aria-label="directions">
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>}
                                readOnly value={url} />
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={1000}
            open={snackbarOpen}
            onClose={onSnackbarClose}
            message={snackbarMessage}
        />
    </>
};