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
    datastoreActions,
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
    datastoreActions.setComparisonMode(mode);
    // perhaps iterate through each available item of the four metrics and create
    // an average compliance, and return that is our dataResults?
    // it is horrible and we would make a request for every item in a metric
    // but whatever, then once we have aggregated scores each day per metric
    // we can then... glue them all together like we do with measures and voila
    // "measure" would really be the "metric" but whatever, the chart would eat it up

    // the new aggregateByDate function will take the dataResults mass and parse it down
    // to an average if we can at least filter the data by metric first... lort, that filter drawer

    // ----------------

    // get the actual name of the filter
    // const metric = Object.entries(aliasObj).find(([k, v]) => k === comparisonMode ?? v);
    // console.log('metric: ', metric)
    // // now we need to go through and fetch the data for each item of the metric,
    // // aggregate, and then push to the metricObj
    // const metricObj = filterOptions[metric].map(async (item, idx) => {
    //   console.log('item: ', item)
    //   const filter = await filterSearch(
    //     metric,
    //     filters[idx], // index from list of metric
    //   );
    
    // apparently the below doesn't work because there is no gd simple
    // way to get fresh data easily in this app lol
    // const freshData = await filterSearch(false, defaultFilterOptions);
    // console.log('fresh data: ', freshData)

    // okay am I able to just flipping call hera for the new data keith provided?
    // expected obj:
    // {
    //   "measurementYear": 2025,
    //   "measurementType": "aise",
    //   "compareOption": "healthcareProviders"
    // }

    if (mode === 'Default') {
      setIsLoading(true)
      handleResetData();
    } else {
      const comparisonBody = {
        measurementYear,
        measurementType: activeMeasure.measure,
        compareOption: Object.keys(aliasObj).find((k) => aliasObj[k] === mode),
      } 
  
      console.log('prepared body: ', comparisonBody)
      const comparisonURL = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}/measures/compare`);
      const comparisonPromise = await axios.post(comparisonURL, { ...comparisonBody });
      
      console.log(comparisonPromise)
  
      if (comparisonPromise.status === 200) {
        datastoreActions.setResults(comparisonPromise.data)
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
