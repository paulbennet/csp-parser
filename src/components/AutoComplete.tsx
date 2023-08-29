import React, { useEffect, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Snackbar, TextField } from '@mui/material';
import { evaluatePolicy } from '../utils/csp-utils';

const filter = createFilterOptions<string>();

type AutoCompleteTextFieldProps = {
    directive: string,
    suggestions: string[],
    handleAddSources: Function
}

export const AutoCompleteTextField: React.FC<AutoCompleteTextFieldProps> = ({ directive, suggestions, handleAddSources }) => {
    const [value, setValue] = useState<string | null>("");
    const [inputValue, setInputValue] = useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");

    useEffect(() => {
        if (value) {
            if (evaluatePolicy(directive, value)) {
                handleAddSources(value);
                setValue("");
                setInputValue("")
            } else {
                setSnackbarMessage(`Invalid source for '${directive}' directive!`)
                setSnackbarOpen(true);
            }
        }
    }, [value])

    const onSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return <>
        <Autocomplete
            size="small"
            freeSolo
            onChange={(_event: any, newValue: string) => {
                if (newValue?.startsWith("Add")) {
                    newValue = newValue.replaceAll(/^Add\s"/g, "").slice(0, -1);
                }

                setValue(newValue)
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
                if (newInputValue?.startsWith("Add")) {
                    newInputValue = newInputValue.replaceAll(/^Add\s"/g, "").slice(0, -1);
                }

                setInputValue(newInputValue);
            }}
            options={suggestions}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option);

                if (inputValue !== '' && !isExisting) {
                    filtered.push(`Add "${inputValue}"`);
                }

                return filtered;
            }}
            renderInput={(params) => <TextField {...params} label="Sources" />}
        />
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={1000}
            open={snackbarOpen}
            onClose={onSnackbarClose}
            message={snackbarMessage}
        />
    </>
};