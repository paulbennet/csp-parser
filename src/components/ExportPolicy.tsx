import React, { useEffect, useState } from 'react'
import IosShareIcon from '@mui/icons-material/IosShare'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import FilledInput from '@mui/material/FilledInput'
import DialogContentText from '@mui/material/DialogContentText'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputAdornment from '@mui/material/InputAdornment'
import { type PolicyResult, getPolicyString } from '../utils/csp-utils'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Fab from '@mui/material/Fab'
import RemoveIcon from '@mui/icons-material/Remove'

interface ExportPolicyProps {
  deleteSourcesWithRegex: (regex) => void
  handleReplace: (oldSourceName, newSourceName) => void
  handleReset: () => void
  directives: PolicyResult
}

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const actions = [
  { icon: <IosShareIcon />, name: 'Export' },
  { icon: <FindReplaceIcon />, name: 'Replace' },
  { icon: <RemoveIcon />, name: 'Delete' },
  { icon: <RestartAltIcon />, name: 'Reset' }
]

const titles = {
  Export: 'Export Policy',
  Replace: 'Replace sources',
  Delete: 'Delete all sources'
}

export const ExportPolicy: React.FC<ExportPolicyProps> = ({ deleteSourcesWithRegex, handleReplace, handleReset, directives }) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [json, setJson] = useState<string>('')
  const [url, setURL] = useState<string>('')
  const [policyString, setPolicyString] = useState<string>('')
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('')
  const [action, setAction] = useState('')
  const [oldSourceName, setOldSourceName] = useState('')
  const [newSourceName, setNewSourceName] = useState('')

  const [regex, setRegex] = useState('')

  const constructPolicyString = (): void => {
    const policyString = getPolicyString(directives)

    setPolicyString(policyString)
    setURL(`${window.location.origin}?config=${window.btoa(policyString)}`)
  }

  useEffect(() => {
    if (isOpen) {
      setJson(JSON.stringify(directives))
      constructPolicyString()
    }
  }, [isOpen, directives])

  const handleClose = (): void => {
    setOpen(false)
  }

  const onSnackbarClose = (): void => {
    setSnackbarOpen(false)
  }

  const handleOnClick = (type: string): void => {
    let content = ''
    if (type === 'policyString') {
      content = policyString
    } else if (type === 'json') {
      content = json
    } else {
      content = url
    }

    navigator.clipboard.writeText(content)
      .then(() => {
        setSnackbarMessage('Copied to clipboard!')
        setSnackbarOpen(true)
      })
      .catch((_err) => {
        setSnackbarMessage('Error!')
        setSnackbarOpen(true)
      })
  }

  const handleAction = (action: string): void => {
    if (action !== 'Reset') {
      setAction(action)
      setOpen(true)
    } else {
      handleReset()
      setSnackbarMessage('Policy has been reset!')
      setSnackbarOpen(true)
    }
  }

  const handleOldSourceChange = (event): void => {
    setOldSourceName(String(event.target.value))
  }

  const handleNewSourceChange = (event): void => {
    setNewSourceName(String(event.target.value))
  }

  const handleRegexChange = (event): void => {
    setRegex(String(event.target.value))
  }

  const handleReplaceSources = (): void => {
    handleReplace(oldSourceName, newSourceName)
    setOpen(false)
    setSnackbarMessage('Sources have been replaced with new values!')
    setSnackbarOpen(true)
    setNewSourceName('')
    setOldSourceName('')
  }

  const handleDeleteSourcesWithRegex = (): void => {
    if (regex.trim().length > 0) {
      deleteSourcesWithRegex(regex)
      setOpen(false)
      setSnackbarMessage('Sources have been deleted!')
      setSnackbarOpen(true)
      setRegex('')
    }
  }

  return <>
        <SpeedDial
            sx={{ position: 'absolute' }}
            ariaLabel="SpeedDial playground example"
            icon={<MoreVertIcon />}
            direction="down"
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    onClick={() => { handleAction(action.name) }}
                    tooltipTitle={action.name}
                />
            ))}
        </SpeedDial>
        <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth={action === 'Delete' ? 'sm' : 'md'}
            onClose={handleClose}
        >
            <DialogTitle>{titles[action]}</DialogTitle>
            <DialogContent>
                {
                    action === 'Export' && <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <DialogContentText>Policy String</DialogContentText>
                            <FormControl fullWidth>
                                <FilledInput
                                    endAdornment={<InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                              handleOnClick('policyString')
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
                                              handleOnClick('json')
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
                                              handleOnClick('url')
                                            }}
                                            color="primary" sx={{ p: '10px' }} aria-label="directions">
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </InputAdornment>}
                                    readOnly value={url} />
                            </FormControl>
                        </Grid>
                    </Grid>
                }
                {
                    action === 'Replace' && <Grid container spacing={5}>
                        <Grid item xs={5}>
                            <DialogContentText>Old Source name</DialogContentText>
                            <FormControl fullWidth>
                                <FilledInput value={oldSourceName} onChange={handleOldSourceChange} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <DialogContentText>New Source name</DialogContentText>
                            <FormControl fullWidth>
                                <FilledInput value={newSourceName} onChange={handleNewSourceChange} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Fab color="primary" onClick={handleReplaceSources}>
                                <RestartAltIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                }
                {
                    action === 'Delete' && <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <DialogContentText>Source name to delete</DialogContentText>
                            <FormControl fullWidth>
                                <FilledInput autoFocus value={regex} onChange={handleRegexChange} />
                            </FormControl>
                        </Grid>
                    </Grid>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {
                    action === 'Delete' &&
                    <Button variant="contained" onClick={handleDeleteSourcesWithRegex}>Delete</Button>
                }
            </DialogActions>
        </Dialog>
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={1000}
            open={snackbarOpen}
            onClose={onSnackbarClose}
            message={snackbarMessage}
        />
    </>
}
