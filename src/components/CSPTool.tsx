import React, { useEffect, useState } from "react";
import { Directives } from "./AddPolicy";
import { ImportPolicy } from "./ImportPolicy";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { Typography } from "@mui/material";
import { policyParser } from "../utils/csp-parser";
import directivesArray from "../utils/directives";
import { AddDialog } from "./AddDialog";

export const CSPTool: React.FC = () => {

    const [directives, setDirectives] = useState<Object>({})
    const [directiveList, setDirectiveList] = useState<string[]>([]);
    const [isOpen, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setDirectiveList(directivesArray);
        const dirs = {};
        directivesArray.forEach((directive) => {
            dirs[directive] = [];
        });
        setDirectives(dirs);
    }, [])

    useEffect(() => {
        const dirList = [...directivesArray];
        const keys = [];
        Object.keys({...directives})
            .forEach((directive) => {
                if (directives[directive].length > 0) {
                    keys.push(directive);
                }
            })
        const dirs = dirList.filter((dir) => {
            return !keys.includes(dir);
        })

        setDirectiveList(dirs);
        console.log(directives);
    }, [directives]);

    const onClose = () => {
        setOpen(false);
    }

    const handleAddDirective = (policy: string, addPolicy: string) => {

        if (policy?.length > 0) {
            const csp = policyParser(policy);
            const dir = { ...directives }

            Object.keys(csp)
                .forEach((item) => {
                    if (directivesArray.includes(item)) {
                        const sources = Array.from(new Set(dir[item].concat(csp[item])));
                        dir[item] = sources;
                    }
                });
            setDirectives(dir);
        } else if (addPolicy === "add-policy") {
            setOpen(true);
        }
    };

    const addSourcesToDirective = (dir: string, src: string) => {
        const policies = { ...directives };

        if (src.length === 0) {
            policies[dir] = [];
        } else if (policies[dir].length === 0) {
            policies[dir] = src.split(", ");
        } else {
            const sources = Array.from(new Set(src.split(", ")));
            policies[dir] = sources;
        }
        setDirectives(policies);
        setOpen(false);
    };

    return (<React.Fragment>
        <Typography component={'span'} variant={'body2'}>
            <Grid container spacing={4} sx={{ padding: "100px" }}>
                <Grid item xs={12}>
                    <ImportPolicy callback={handleAddDirective} />
                </Grid>
                <Grid item xs={12}>
                    <Divider>
                        <Chip label="Policies" />
                    </Divider>
                </Grid>
                <Grid item xs={12}>
                    <Directives directives={directives} addSourcesToDirective={addSourcesToDirective} />
                </Grid>
            </Grid>
            <AddDialog
                isOpen={isOpen}
                onClose={onClose}
                directiveList={directiveList}
                addDirective={addSourcesToDirective} />
        </Typography>
    </React.Fragment>)
}