import { Box, Link, Typography } from '@mui/material';
import theme from '../../assets/styles/AppTheme';
import env from '../../env';

const Queries = [
  { name: 'Yearly Comparison' },
  { name: 'Composite Report' },
  { name: 'Current Snapshot Report' },
  { name: '60 Day Comparison' },
];

export default function SavedQueries() {
  const placeholder = (query) => `${env.REACT_APP_HEDIS_MEASURE_API_URL}measures/exportCsv?reportType=${query.name
    .split('')
    .map((l) => (l !== ' ' ? l.toLocaleLowerCase() : '-'))
    .join('')}`;

  return (
    <Box
      sx={{
        color: theme.palette?.bluegray.D1,
        border: `1px solid ${theme.palette?.bluegray.L3}`,
      }}
      className="saved-queries"
    >
      <Typography variant="h2" className="saved-queries__h2-header">Saved Queries</Typography>
      <Typography className="saved-queries__text">
        Generate data based off your previous queries.
      </Typography>
      <ul className="saved-queries__past-search">
        {Queries.map((query) => (
          <li key={query.name} className="saved-queries__past-search-item">
            <Link target="_blank" rel="noreferrer" href={placeholder(query)}>
              {query.name}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
}
