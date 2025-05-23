import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { gapi } from 'gapi-script';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import LockIcon from '@mui/icons-material/Lock';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Logo from '../../assets/img/saraswati-logo.png';
import Alert from '../../components/Utilities/Alert';
import theme from '../../assets/styles/AppTheme';
import env from '../../env';

export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname === '/register' ? 'register' : 'login';
  const isLogin = mode === 'login';
  const clientId = env.REACT_APP_GOOGLE_CLIENT_ID;
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLogin) return;
    gapi.load('client:auth2', () => {
      gapi.client.init({ clientId, scope: 'openid profile email' });
    });
  }, [isLogin, clientId]);

  const responseGoogle = async (response) => {
    if (!response.accessToken) {
      setError(true);
      return;
    }
    try {
      const loginUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}user/login`);
      const loginPromise = await axios.post(loginUrl, {
        token: response.tokenId,
        allItems: response,
      });
      if (loginPromise.data.status === 'Success') {
        localStorage.setItem('token', response.accessToken);
        setError(false);
        navigate('/');
        window.location.reload();
      }
    } catch {
      setError(true);
      navigate('/welcome');
    }
  };

  const handleReset = () => setError(false);

  return (
    <main style={{
      background: theme.palette.bluegray.L4, height: '100vh', padding: '2rem', marginBottom: '-1rem',
    }}
    >
      {error && (
        <Alert
          openAlert={error}
          setOpenAlert={setError}
          title={isLogin ? 'Failed to Login' : 'Registration Error'}
          noResultsAlert
          handleResetData={handleReset}
          buttonText="retry"
        >
          {isLogin
            ? 'There was an error logging in.'
            : 'There was an error in the provided registration information.'}
        </Alert>
      )}

      <Container maxWidth={false} sx={{ padding: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img style={{ height: '3rem' }} src={Logo} alt="Saraswati logo" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>SARASWATI</Typography>
        </Box>

        <Paper sx={{
          backgroundColor: theme.palette.background.main, borderRadius: '3px', padding: '2rem', minWidth: '50%', marginTop: '2rem', placeSelf: 'center',
        }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={9}>
              <Typography variant="h3" sx={{ fontWeight: 500, mb: '1rem' }}>
                {isLogin ? 'Sign in' : 'Register'}
              </Typography>
            </Grid>
            {isLogin && env.REACT_APP_MVP_SETTING === false && (
              <Grid item xs={6} md={3}>
                <Typography variant="body1">No Account?</Typography>
                <Link component={RouterLink} to="/register" color="primary" underline="none" sx={{ fontWeight: 500 }}>
                  Sign Up
                </Link>
              </Grid>
            )}
            {!isLogin && (
              <Grid item xs={6} md={3}>
                <Typography variant="body1">Have an account?</Typography>
                <Link component={RouterLink} to="/welcome" color="primary" underline="none" sx={{ fontWeight: 500 }}>
                  Sign In
                </Link>
              </Grid>
            )}
          </Grid>

          <Grid container spacing={2} direction="column" sx={{ my: '.5rem' }}>
            <Grid item>
              <Typography variant="h6" sx={{ my: '.5rem' }}>
                {isLogin ? 'Enter your email address' : 'Sign up by providing the following'}
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                required
                label="Email"
                type="email"
                id={isLogin ? 'loginEmail' : 'registerEmail'}
                margin="dense"
                placeholder="Email address"
                InputProps={{ startAdornment: <PersonRoundedIcon fontSize="small" sx={{ mr: '.5rem' }} /> }}
                sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.bluegray.L5 } }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6">Enter your password</Typography>
              <TextField
                variant="outlined"
                fullWidth
                required
                label="Password"
                type="password"
                id={isLogin ? 'loginPassword' : 'registerPassword1'}
                margin="dense"
                placeholder="Password"
                InputProps={{ startAdornment: <LockIcon fontSize="small" sx={{ mr: '.5rem' }} /> }}
                sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.bluegray.L5 } }}
              />
              {!isLogin && (
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  label="Confirm Password"
                  type="password"
                  id="registerPassword2"
                  margin="dense"
                  placeholder="Confirm Password"
                  InputProps={{ startAdornment: <LockIcon fontSize="small" sx={{ mr: '.5rem' }} /> }}
                  sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.bluegray.L5 } }}
                />
              )}
            </Grid>

            {isLogin && (
              <Link component={RouterLink} to="#forgot-password" color="primary" underline="none" sx={{ m: '1rem 0 0 0', alignSelf: 'end' }}>
                Forgot password
              </Link>
            )}
          </Grid>

          {isLogin && (
            <Grid container spacing={2} direction="column" sx={{ my: '.5rem' }}>
              <Grid item>
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Sign in with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy="single_host_origin"
                  isSignedIn={false}
                />
              </Grid>
            </Grid>
          )}

          <Box sx={{ width: '100%', textAlign: 'end', '&:hover': { pointerEvents: 'auto', cursor: 'not-allowed' } }}>
            <Button variant="contained" color="primary" disabled sx={{ width: '12rem', height: '3rem' }}>
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </main>
  );
}
