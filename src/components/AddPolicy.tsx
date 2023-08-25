import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';


type DirectivesProps = {
    directives: Object,
    addSourcesToDirective: Function
};

type DirectiveFieldProps = {
    dir: string,
    src: string[],
    addSourcesToDirective: Function
};

const DirectiveField: React.FC<DirectiveFieldProps> = ({ dir, src, addSourcesToDirective }) => {
    const [directive, setDirective] = useState<string>("");
    const [sources, setSources] = useState<string>("");

    useEffect(() => {
        setDirective(dir);
        setSources(src.join(", "));
    }, [dir, src]);

    const handleOnEnter = (event) => {
        if (event.keyCode === 13 || event.key === "Enter") {
            addSourcesToDirective(dir, sources)
        }
    };

    const handleOnChange = (event) => {
        setSources(event.target.value);
    };

    return (
        <Grid container spacing={4}>
            <Grid item xs={4}>
                <Badge badgeContent={sources.split(",").length} color="primary">
                    <TextField
                        size="small"
                        id="directive-textarea"
                        label="Directive"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={directive}
                    />
                </Badge>
            </Grid>
            <Grid item xs={8}>
                <TextField
                    size="small"
                    fullWidth
                    id="sources-textarea"
                    label="Sources"
                    value={sources}
                    onKeyDown={handleOnEnter}
                    onChange={handleOnChange}
                />
            </Grid>
        </Grid>
    )
};


export const Directives: React.FC<DirectivesProps> = ({ directives, addSourcesToDirective }) => {

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
                                    <DirectiveField dir={directive} src={directives[directive]} addSourcesToDirective={addSourcesToDirective}/>
                                </Grid>

                            }
                        })
                }
            </Grid>
        </Container>
    </React.Fragment>

};