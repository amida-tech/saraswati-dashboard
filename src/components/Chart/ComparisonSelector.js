/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import { useState, useContext, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import { filterSearch } from '../Common/Controller';
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
  activeMeasure, handleResetData, isComposite, setIsLoading,
  setDisplayData, setSelectedMeasures, setCurrentResults,
}) {
  const {
    datastore: {
      measurementYear, comparisonMode, filterOptions,
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

  // handles comparison mode no matter what, even if you were changing the year,
  // went composite view to submeasure view, are in the member table view,
  // anything that isn't expressly the selection dropdown
  useEffect(() => {
    if (!comparisonMode || comparisonMode === 'Default') {
      return;
    }

    let didCancel = false;

    const fetchFreshData = async () => {
      setIsLoading(true);
      const filterKey = Object.entries(aliasObj)
        .find(([, label]) => label === comparisonMode)?.[0];
      const items = filterKey ? (filterOptions[filterKey] || []) : [];
      const allResults = [];

      for (const item of items) {
        // eslint-disable-next-line no-await-in-loop
        const search = await filterSearch(
          false,
          [item.value],
          isComposite,
          measurementYear,
        );
        allResults.push(
          ...search.dailyMeasureResults.map((r) => ({ ...r, measure: item.value })),
        );
      }

      if (!didCancel) {
        setCurrentResults(allResults);
        setDisplayData(allResults);
        setSelectedMeasures(items.map((i) => i.value));
        setIsLoading(false);
      }
    }

    fetchFreshData();

    return () => {
      didCancel = true;
    };
  }, [
    comparisonMode,
    isComposite,
    measurementYear,
  ]);

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
        // compareOption: Object.keys(aliasObj).find((k) => aliasObj[k] === mode),
        compareOption: mode,
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
          value={comparisonMode || 'default'}
          onChange={handleChange}
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
  setIsLoading: PropTypes.func,
  isComposite: PropTypes.bool,
  setDisplayData: PropTypes.func,
  setSelectedMeasures: PropTypes.func,
  setCurrentResults: PropTypes.func,
};

ComparisonSelector.defaultProps = {
  handleResetData: () => {},
  activeMeasure: '',
  setIsLoading: false,
  isComposite: false,
  setDisplayData: {},
  setSelectedMeasures: () => {},
  setCurrentResults: () => {},
};

export default ComparisonSelector;
