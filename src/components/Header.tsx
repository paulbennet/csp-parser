import React from 'react';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button } from '@mui/material';
import Link from '@mui/material/Link';

// 

function appBarLabel(label: string) {
    return (
        <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {label}
            </Typography>
            <Button color="inherit" endIcon={<GitHubIcon />}>
                <Link color="white" href="https://github.com/SubareeshKrishnan/csp-parser" target="_blank" rel="noopener" underline="none">
                    {"Github"}
                </Link></Button>
        </Toolbar>
    );
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

export default function Header() {
    return (
        <Stack spacing={2}>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="absolute" color="primary">
                    {
                        appBarLabel('CSP Config Manager')
                    }
                </AppBar>
            </ThemeProvider>
        </Stack>
    );
}
