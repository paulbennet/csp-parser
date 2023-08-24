import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import directives from "../utils/directives";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

type DirectivesProps = {
    directives: Object
};

type DirectiveFieldProps = {
    dir: string,
    src: string[]
};

const DirectiveField: React.FC<DirectiveFieldProps> = ({ dir, src }) => {
    const [directive, setDirective] = React.useState<string>("");
    const [sources, setSources] = React.useState<string[]>([]);

    useEffect(() => {
        setDirective(dir);
        setSources(src);
    }, [dir, src]);

    const handleChange = (event: SelectChangeEvent) => {
        setDirective(event.target.value);
    };

    return (
        <Grid container spacing={4}>
            <Grid item xs={4}>
                <FormControl sx={{ minWidth: 150, maxWidth: 150 }} size="small">
                    <Select
                        value={directive}
                        onChange={handleChange}
                    >
                        {
                            directives.map((directive) => {
                                return <MenuItem key={directive} value={directive}>{directive}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={8}>
                <TextField
                    size="small"
                    fullWidth
                    id="sources-textarea"
                    label="Sources"
                    value={sources.join(", ")}
                />
            </Grid>
        </Grid>
    )
};


export const Directives: React.FC<DirectivesProps> = ({ directives }) => {

    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        Object.values(directives)
            .forEach((directive) => {
                if (directive.length > 0) {
                    setOpen(true);
                }
            })
    }, [directives]);

    return <React.Fragment>
        <Container fixed>
            <Grid container spacing={2}>
                {
                    isOpen && Object.keys(directives)
                        .map((directive) => {
                            if (directives[directive].length > 0) {
                                return <Grid key={directive} item xs={12}>
                                    <DirectiveField dir={directive} src={directives[directive]} />
                                </Grid>

                            }
                        })
                }
            </Grid>
        </Container>
    </React.Fragment>

};