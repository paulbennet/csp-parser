import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect, useState } from 'react'
import { ExportPolicy } from './ExportPolicy'
import { type PolicyResult } from '../utils/csp-utils'

interface Props {
  deleteSourcesWithRegex: (regex) => void
  handleReplace: (oldSourceName, newSourceName) => void
  handleReset: () => void
  handleAddDirective: (string) => void
  directives: PolicyResult
}

export const ImportPolicy: React.FC<Props> = ({ deleteSourcesWithRegex, handleReplace, handleReset, handleAddDirective, directives }) => {
  const [text, setText] = useState('')

  const handleOnAdd = (): void => {
    handleAddDirective('new')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAddDirective(text)
      setText('')
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [text])

  const handleOnChange = (event: { preventDefault: () => void, target: { value: string } }): void => {
    setText(String(event.target.value))
  }

  return (
        <Grid container spacing={1}>
            <Grid item xs={1} sx={{ overflowY: 'hidden' }}>
                <ExportPolicy deleteSourcesWithRegex={deleteSourcesWithRegex} handleReplace={handleReplace} handleReset={handleReset} directives={directives}/>
            </Grid>
            <Grid item xs={1}>
                <Tooltip title="Add directive">
                    <Fab color="primary">
                        <AddIcon onClick={handleOnAdd} />
                    </Fab>
                </Tooltip>
            </Grid>
            <Grid item xs={10}>
                <TextField
                    autoFocus={true}
                    fullWidth
                    id="import-textarea"
                    label="Import CSP"
                    value={text}
                    placeholder="default-src 'self';...."
                    onChange={handleOnChange}
                />
            </Grid>
        </Grid>
  )
}
