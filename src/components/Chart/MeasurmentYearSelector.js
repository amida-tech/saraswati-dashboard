import { useContext } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { DatastoreContext } from '../../context/DatastoreProvider';

function MeasurementYearSelector() {
  const { datastore, datastoreActions } = useContext(DatastoreContext);
  const { measurementYear } = datastore;
  const availableYears = [2022, 2025];

  // check localStorage for saved year
  // useEffect(() => {
  //   const storedYear = localStorage.getItem('selectedYear');

  //   // Only update if there's a valid year in localStorage
  //   if (storedYear && availableYears.includes(Number(storedYear))) {
  //     datastoreActions.setMeasurementYear(Number(storedYear));
  //   }
  //   if (!storedYear && !measurementYear) {
  //     // If no year is stored, set the default to the first available year
  //     const defaultYear = availableYears[0];
  //     datastoreActions.setMeasurementYear(defaultYear);
  //     localStorage.setItem('selectedYear', defaultYear);
  //   }
  // }, []);

  const handleYearChange = (event) => {
    const newYear = event.target.value;

    datastoreActions.setMeasurementYear(newYear);

    // Save to localStorage for persistence across pages and sessions
    localStorage.setItem('selectedYear', newYear);
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      disabled={datastore.comparisonMode !== 'default'} // only for now
      sx={{
        minWidth: 180,
        '& .MuiInputLabel-root': {
          backgroundColor: 'white',
          paddingRight: '8px',
          paddingLeft: '4px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          textAlign: 'left',
          '& legend': {
            maxWidth: '170px',
          },
        },
      }}
    >
      <InputLabel id="measurement-year-select-label">Measurement Year</InputLabel>
      <Select
        labelId="measurement-year-select-label"
        id="measurement-year-select"
        value={measurementYear || ''}
        onChange={handleYearChange}
        label="Year"
        data-testid="measurement-year-selector"
      >
        {availableYears.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MeasurementYearSelector;
