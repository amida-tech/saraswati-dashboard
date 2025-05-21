import { useState, useEffect } from 'react'
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { Snackbar } from '@mui/material'
import theme from './assets/styles/AppTheme'
import ProtectedRoutes from './ProtectedRoutes'
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import LoadingPage from './components/Utilities/LoadingPage'
import { validateAccessToken } from './components/Common/Controller'

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    (async () => {
      const hash = window.location.hash.replace('#', '')
      const params = new URLSearchParams(hash)
      const urlToken = params.get('access_token')

      if (urlToken) {
        localStorage.setItem('token', urlToken)
        setAuthenticated(true)
        setShowWelcome(true)
      } else {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
          try {
            const valid = await validateAccessToken(storedToken)
            setAuthenticated(valid)
            if (valid) setShowWelcome(true)
          } catch {
            setAuthenticated(false)
          }
        }
      }

      setLoading(false)
    })()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={showWelcome}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setShowWelcome(false)}
        message="Welcome to Saraswati, where knowledge is power."
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: theme.palette?.primary.light,
            color: theme.palette?.text.primary,
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              authenticated
                ? <ProtectedRoutes authenticated={authenticated} />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
