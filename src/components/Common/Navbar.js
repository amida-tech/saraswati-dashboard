import {
  AppBar,
  Box,
  Toolbar,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import theme from '../../assets/styles/AppTheme';
import Logo from '../../assets/img/saraswati-logo.png';

const logout = () => {
  localStorage.removeItem('token');
};
const Offset = styled('div')(theme.mixins.toolbar);

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: theme.palette?.bluegray.D4 }}>
        <Toolbar position="fixed">
          <Box sx={{
            pl: '.7rem', display: 'flex', alignItems: 'center', gap: '1rem',
          }}
          >
            <img style={{ height: '2rem' }} src={Logo} alt="Saraswati logo" />
            <Link
              sx={{ color: theme.palette?.bluegray.L4 }}
              component={RouterLink}
              className="navbar__text"
              to="/"
            >
              Saraswati
            </Link>
          </Box>
          <Box sx={{
            flexGrow: 1, display: 'flex', gap: '2rem', justifyContent: 'flex-end',
          }}
          >
            <Link
              sx={{ color: theme.palette?.bluegray.L4 }}
              component={RouterLink}
              className="navbar__text"
              to={{ pathname: '/' }}
            >
              Dashboard
            </Link>
            <Link
              sx={{ color: theme.palette?.bluegray.L4 }}
              component={RouterLink}
              className="navbar__text"
              to={{ pathname: '/reports' }}
            >
              Reports
            </Link>
            <Link
              sx={{ color: theme.palette?.bluegray.L4 }}
              component={RouterLink}
              className="navbar__text"
              to={{ pathname: '/welcome' }}
              onClick={logout}
            >
              Sign Out
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}
