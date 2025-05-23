import LockIcon from '@mui/icons-material/Lock';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
  Box, Button, Container, Grid, Paper, TextField, Typography,
} from '@mui/material';

import { useState } from 'react';
import Logo from '../../assets/img/saraswati-logo.png';
import Alert from '../../components/Utilities/Alert';
import theme from '../../assets/styles/AppTheme';

export default function Register() {
  const [validationError, setValidationError] = useState(false);

  return (
    <main
      style={{
        background: theme.palette?.bluegray.L4,
        height: '100vh',
        padding: '2rem',
        marginBottom: '-1rem',
      }}
    >
      {validationError && (
        <Alert
          openAlert={validationError}
          setOpenAlert={setValidationError}
          title="Registration Error"
          noResultsAlert
          handleResetData={handleReset}
          buttonText="retry"
        >
          There was an error in the provided registration information.
        </Alert>
      )}

      <Container maxWidth={false} sx={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img style={{ height: '3rem' }} src={Logo} alt="Saraswati logo" />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            SARASWATI
          </Typography>
        </div>

        <Paper
          sx={{
            backgroundColor: theme.palette?.background.main,
            borderRadius: '3px',
            padding: '2rem',
            minWidth: '50%',
            marginTop: '2rem',
            placeSelf: 'center',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={9}>

              <Typography variant="h3" sx={{ fontWeight: 500, mb: '1rem' }}>
                Register
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="column" sx={{ my: '.5rem' }}>
            <Grid item>
              <Typography variant="h6" sx={{ my: '.5rem' }}>
                Sign up by providing the following
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                required
                label="Email"
                id="registerEmailInput"
                type="email"
                margin="dense"
                InputProps={{
                  startAdornment: <PersonRoundedIcon fontSize="small" sx={{ mr: '.5rem' }} />,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: theme.palette.bluegray?.L5,
                  },
                }}
                placeholder="Email address"
              />
            </Grid>
            <Grid item>
              <Typography variant="h6">
                Ensure your password is strong and they match
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                required
                label="Password"
                type="password"
                id="register-password-1"
                margin="dense"
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: theme.palette.bluegray?.L5,
                  },
                }}
                InputProps={{
                  startAdornment: <LockIcon fontSize="small" sx={{ mr: '.5rem' }} />,
                }}
                placeholder="Password"
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                label="Confirm Password"
                type="password"
                id="register-password-2"
                margin="dense"
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: theme.palette.bluegray?.L5,
                  },
                }}
                InputProps={{
                  startAdornment: <LockIcon fontSize="small" sx={{ mr: '.5rem' }} />,
                }}
                placeholder="Confirm Password"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              width: '100%',
              textAlign: 'end',
              '&:hover': {
                pointerEvents: 'auto',
                cursor: 'not-allowed',
              },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled
              sx={{
                width: '12rem',
                height: '3rem',
              }}
            >
              Register
            </Button>
          </Box>

        </Paper>
      </Container>
    </main>
  );
}
