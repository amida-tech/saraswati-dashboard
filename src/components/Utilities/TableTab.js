/* eslint-disable react/jsx-props-no-spreading */
import { Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

// BELOW IS AN EXAMPLE OF HOW WE SHOULD BE DOING CUSTOM COMPONENTS IN MUI 5
// WHEN WE REFACTOR SCSS OUT, THIS IS THE MUI STANDARD
export const TableTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  color: theme.palette?.primary.light,
  maxHeight: '2.2rem',
  fontWeight: 'light',
  padding: '0 2rem',
  border: 'unset',
  textTransform: 'capitalize',
  fontSize: '1.3rem',
  margin: '1rem .5rem',

  '&:hover': {
    color: theme.palette?.primary.light,
    backgroundColor: theme.palette?.transparent.primary,
    borderRadius: '0.5rem',
    transition: '200ms',
  },

  '&:focus': {
    color: theme.palette?.primary.light,
    backgroundColor: theme.palette?.transparent.primary,
    borderRadius: '0.5rem',
    transition: '200ms',
  },

  '&.Mui-selected': {
    color: theme.palette?.primary.main,
    backgroundColor: theme.palette?.primary.light,
    borderRadius: '.5rem',
    height: '1.5rem',
    placeSelf: 'center',
  },
}));
