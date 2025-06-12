/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import { useState, useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import Notification from '../Common/Notification';
import { DatastoreContext } from '../../context/DatastoreProvider';
import env from '../../env';

export const comparisonModeLabels = [
  {
    label: 'Default',
    value: 'default',
  },
  {
    label: 'Payors',
    value: 'payors',
    single: 'Payor',
  },
  {
    label: 'Providers',
    value: 'healthcareProviders',
    single: 'Provider',
  },
  {
    label: 'Coverage',
    value: 'healthcareCoverages',
    single: 'Coverage',
  },
  {
    label: 'Practitioners',
    value: 'healthcarePractitioners',
    single: 'Practitioner',
  },
]

function ComparisonSelector({
  activeMeasure, handleResetData, filterActivated,
}) {
  const {
    datastore: {
      measurementYear, comparisonMode,
    },
    datastoreActions: {
      setComparisonMode, setResults, updateRefresh, setIsLoading,
    },
  } = useContext(DatastoreContext);
  const [error, setError] = useState(undefined);
  // todo: not this
  const comparisonDisabled = filterActivated;

  const handleChange = async (e) => {
    setIsLoading(true);
    const mode = e.target.value;
    setComparisonMode(mode);

    if (mode === 'default') {
      handleResetData();
      updateRefresh();
    } else {
      const comparisonBody = {
        measurementYear,
        measurementType: activeMeasure.measure,
        compareOption: mode,
      }

      const comparisonURL = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}/measures/compare`);
      const comparisonPromise = await axios.post(comparisonURL, { ...comparisonBody });

      if (comparisonPromise.status === 200) {
        setResults(comparisonPromise.data.results, comparisonPromise.data.info);
        setIsLoading(false);
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
          value={comparisonMode || 'default'}
          onChange={handleChange}
          disabled={comparisonDisabled}
          label="Comparison Mode"
          data-testid="comparison-selector"
        >
          {comparisonModeLabels.map((mode) => (
            <MenuItem key={mode.value} value={mode.value}>
              {mode.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

ComparisonSelector.propTypes = {
  handleResetData: PropTypes.func,
  activeMeasure: PropTypes.shape({
    measure: PropTypes.string,
  }),
  filterActivated: PropTypes.bool,
};

ComparisonSelector.defaultProps = {
  handleResetData: () => {},
  activeMeasure: '',
  filterActivated: false,
};

export default ComparisonSelector;
