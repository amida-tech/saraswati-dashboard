import { useContext } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { DatastoreContext } from '../../context/DatastoreProvider';

export default function ComparisonSelector() {
  const {
    datastore: { comparisonMode },
    datastoreActions,
  } = useContext(DatastoreContext);

  const comparisonModes = [
    'Default',
    'Payors',
    'Providers',
    'Coverage',
    'Practitioners',
  ];

  const handleChange = (e) => {
    const mode = e.target.value;
    datastoreActions.setComparisonMode(mode);
    localStorage.setItem('comparisonMode', mode);
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        minWidth: 180,
        '& .MuiInputLabel-root': {
          backgroundColor: 'white',
          paddingRight: '8px',
          paddingLeft: '4px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          textAlign: 'left',
          '& legend': { maxWidth: '170px' },
        },
      }}
    >
      <InputLabel id="comparison-select-label">
        Comparison Mode
      </InputLabel>
      <Select
        labelId="comparison-select-label"
        id="comparison-select"
        value={comparisonMode}
        onChange={handleChange}
        label="Comparison Mode"
        data-testid="comparison-selector"
      >
        {comparisonModes.map((mode) => (
          <MenuItem key={mode} value={mode}>
            {mode}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
