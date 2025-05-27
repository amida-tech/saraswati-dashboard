import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#DFF4FC',
      dark: '#162F8A',
    },
    transparent: {
      primary: '#DFF4FC40',
    },
    secondary: {
      main: '#546E7A',
      light: '#B0BEC5',
      dark: '#455A64',
    },
    background: {
      main: '#F7F8FC',
      secondary: '#1976D2',
    },
    success: {
      main: '#2E7D32',
      light: '#47BB4D',
      dark: '#235F26',
    },
    text: {
      primary: '#263238',
      secondary: '#546E7A',
      disabled: '#90A4AE',
    },
    warning: {
      main: '#FFCA28;',
      light: '#FFD75E',
      dark: '#DEA600',
    },
    error: {
      main: '#C62828',
      light: '#DD5757',
      dark: '#951F1F',
    },
    bluegray: {
      main: '#607D8B',
      L5: '#ECEFF1',
      L4: '#CFD8DC',
      L3: '#B0BEC5',
      L2: '#90A4AE',
      L1: '#78909C',
      D1: '#546E7A',
      D2: '#455A64',
      D3: '#37474F',
      D4: '#263238',
    },
  },
  typography: {
    color: '#263238',
  },

  components: {

    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#546E7A',
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },

    MuiInput: {
      styleOverrides: {
        root: {
          transition: '400ms !important',
          '&:hover': {
            cursor: 'pointer',
            animationTimingFunction: 'ease-in-out',
          },
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: {
          transition: '400ms !important',
          '&:hover': {
            cursor: 'pointer',
            animationTimingFunction: 'ease-in-out',
          },
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&:hover': {
            fill: '#1976D2',
          },
        },
      },
    },

  },
  shape: {
    borderRadius: 3,
    borderColor: '#455A64',
  },
});

export default theme;
