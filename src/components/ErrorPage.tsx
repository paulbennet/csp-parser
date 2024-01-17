import * as React from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { Container } from '@mui/material'

export const ErrorPage: React.FC = () => {
  return (
        <Container fixed sx={{ paddingBlockStart: '10%' }}>
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                Page not found! <strong>Or try again with valid key!</strong>
            </Alert>
        </Container>
  )
}
