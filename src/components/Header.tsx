import React from 'react';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function appBarLabel(label: string) {
    return (
        <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {label}
            </Typography>
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
                        appBarLabel('CSP Tool')
                    }
                </AppBar>
            </ThemeProvider>
        </Stack>
    );
}
