/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-param-reassign */
import { useState, useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import Notification from '../Common/Notification';
import { DatastoreContext } from '../../context/DatastoreProvider';
import env from '../../env';

const comparisonModes = [
  'Default',
  'Payors',
  'Providers',
  'Coverage',
  'Practitioners',
];

export default function ComparisonSelector({ activeMeasure, handleResetData, setIsLoading }) {
  const {
    datastore: {
      measurementYear, comparisonMode,
    },
    datastoreActions: {
      setComparisonResults, setComparisonMode,
    },
  } = useContext(DatastoreContext);
  const [error, setError] = useState(undefined);

  const aliasObj = {
    payors: 'Payors',
    healthcareProviders: 'Providers',
    healthcareCoverages: 'Coverage',
    healthcarePractitioners: 'Practitioners',
  };

  const handleChange = async (e) => {
    const mode = e.target.value;
    setComparisonMode(mode);
    
    if (mode === 'Default') {
      setIsLoading(true)
      handleResetData();
    } else {
      const comparisonBody = {
        measurementYear,
        measurementType: activeMeasure.measure,
        compareOption: Object.keys(aliasObj).find((k) => aliasObj[k] === mode),
      } 
  
      const comparisonURL = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}/measures/compare`);
      const comparisonPromise = await axios.post(comparisonURL, { ...comparisonBody });
      
      if (comparisonPromise.status === 200) {
        setComparisonResults(comparisonPromise.data)
      } else {
        setError(comparisonPromise.status)
      }
    }
  };

  return (
    <>
      {error
        && (
        <Notification
          status={error}
        />
        )}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="comparison-select-label">Comparison Mode</InputLabel>
        <Select
          labelId="comparison-select-label"
          id="comparison-select"
          value={comparisonMode || 'Default'}
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
    </>
  );
}
