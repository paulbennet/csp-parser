import React, { useEffect, useState } from "react";
import { Directives } from "./AddPolicy";
import { ImportPolicy } from "./ImportPolicy";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { Typography } from "@mui/material";
import { policyParser } from "../utils/csp-parser";

export const CSPTool: React.FC = () => {

    const [directives, setDirectives] = useState<any>({})

    const handleAddDirective = (policy: string) => {
        
        if (policy.length > 0) {
            console.log("here");
            const csp = policyParser(policy);
            const dir = { ...directives }
            console.log(dir);
            
            Object.keys(csp)
                .forEach((item) => {
                    dir[item] = csp[item];
                });
            setDirectives(dir);
        } else {

        }
    };

    return (<React.Fragment>
        <Typography component={'span'} variant={'body2'}>
            <Grid container spacing={4} sx={{ padding: "100px" }}>
                <Grid item xs={12}>
                    <ImportPolicy callback={handleAddDirective} />
                </Grid>
                <Grid item xs={12}>
                    <Divider>
                        <Chip label="Directives" />
                    </Divider>
                </Grid>
                <Grid item xs={12}>
                    <Directives directives={directives} />
                </Grid>
            </Grid>
        </Typography>
    </React.Fragment>)
}