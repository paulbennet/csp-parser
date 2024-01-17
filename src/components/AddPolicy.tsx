import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { type PolicyResult, sortSources } from '../utils/csp-utils'
import { enqueueSnackbar } from 'notistack'

interface DirectiveFieldProps {
  dir: string
  src: string[] | undefined
  handleDelete: (dir, str) => void
  handleEditDirective: (dir, src) => void
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}))

const DirectiveField: React.FC<DirectiveFieldProps> = ({ dir, src, handleEditDirective, handleDelete }) => {
  const [schemeSources, setSchemeSources] = useState<string[]>([])
  const [hostSources, setHostSources] = useState<string[]>([])

  useEffect(() => {
    const sources = sortSources(src ?? [])
    setSchemeSources(sources.schemeSources)
    setHostSources(sources.hostSources)
  }, [src])

  const handleEdit = (): void => {
    handleEditDirective(dir, src)
  }

  return (
    <Grid container sx={{
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'baseline',
      '&:hover': {
        '.MuiGrid-grid-xs-1': {
          display: 'inline-block'
        }
      }
    }}>
      <Grid item xs={3}>
        <Badge badgeContent={src?.length} color="primary">
          <TextField
            fullWidth
            size="small"
            label="Directive"
            InputProps={{
              readOnly: true
            }}
            onClick={() => {
              void navigator.clipboard.writeText(dir)
              enqueueSnackbar('📋 Directive name copied')
            }}
            value={dir}
          />
        </Badge>
      </Grid>
      <Grid item xs={8}>
        <Paper
          sx={{
            display: 'flex',
            justifyContent: 'start',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0
          }}
          component="ul"
        >
          {
            schemeSources.length > 0 &&
            schemeSources.map((data) => {
              return (
                <ListItem key={data}>
                  <Chip
                    sx={{
                      backgroundColor: '#F1F8E9',
                      // backgroundColor: "#d2e3fc",
                      color: '#000'
                    }}
                    onDelete={() => {
                      handleDelete(dir, data)
                    }}
                    onClick={() => {
                      void navigator.clipboard.writeText(data)
                      enqueueSnackbar('📋 Value copied')
                    }}
                    label={data}
                  />
                </ListItem>
              )
            })
          }
          {
            hostSources.length > 0 &&
            hostSources.map((data) => {
              return (
                <ListItem key={data}>
                  <Chip
                    sx={{
                      backgroundColor: '#E1F5FE',
                      color: '#000'
                    }}
                    onDelete={() => {
                      handleDelete(dir, data)
                    }}
                    onClick={() => {
                      void navigator.clipboard.writeText(data)
                      enqueueSnackbar('📋 Value copied')
                    }}
                    label={data}
                  />
                </ListItem>
              )
            })
          }
        </Paper>
      </Grid>
      <Grid item xs={1}
        sx={{
          display: 'none'
        }}
      >
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>

      </Grid>
    </Grid>
  )
}

interface DirectivesProps {
  directives: PolicyResult
  handleEditDirective: (dir, src) => void
  addSourcesToDirective: (dir, sources) => void
}

export const Directives: React.FC<DirectivesProps> = ({ directives, handleEditDirective, addSourcesToDirective }) => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    Object.values(directives)
      .forEach((directive) => {
        if (directive !== undefined) {
          setOpen(true)
        }
      })
  }, [directives])

  const handleDelete = (dir: string, str: string): void => {
    let sources = directives[dir]

    sources = sources?.filter((src) => {
      return src !== str
    })

    addSourcesToDirective(dir, sources)
  }

  return (
    <React.Fragment>
      <Container fixed>
        <Grid container spacing={2}>
          {
            isOpen && Object.keys(directives)
              .map((directive) => {
                if (directives[directive] !== undefined) {
                  return <Grid key={directive} item xs={12}>
                    <DirectiveField
                      dir={directive}
                      src={directives[directive]}
                      handleDelete={handleDelete}
                      handleEditDirective={handleEditDirective} />
                  </Grid>
                }

                return null
              })
          }
        </Grid>
      </Container>
    </React.Fragment>
  )
}
