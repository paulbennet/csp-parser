import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { CSPTool } from './components/CSPTool'
import Header from './components/Header'
import { type PolicyResult, policyParser } from './utils/csp-utils'
import { ErrorPage } from './components/ErrorPage'
import { SnackbarProvider } from 'notistack'

const App: React.FC = () => {
  const [valid, setValid] = useState<boolean>(false)
  const [directives, setDirectives] = useState<PolicyResult>({})

  useEffect(() => {
    if (window?.location?.search?.length > 0) {
      const searchParams = new URLSearchParams(location.search.substring(location.search.indexOf('?')))

      let config = searchParams.get('config')

      console.log(config)

      if (!searchParams.has('config')) {
        setValid(false)
        return
      }

      if (config?.length === 0) {
        setValid(true)
        return
      }

      try {
        config = window.atob(config ?? '')
        setDirectives(policyParser(config))
        setValid(true)
      } catch (e) {
        console.error(e)

        setValid(false)
      }

      return
    }
    setValid(true)
  }, [])

  return (
    <div className="app">
        <SnackbarProvider />
        {
            valid
              ? (
                <>
                  <Header />
                  <CSPTool directives={directives} />
                </>
                )
              : <ErrorPage />

        }
    </div>
  )
}

const root = document.getElementById('root')

if (root !== null) {
  ReactDOM.createRoot(root).render(<App />)
}
