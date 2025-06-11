import {
  createContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  resultList, trendList, infoObject, userPreferences, widgetPrefs,
} from '../test/data/DemoData';
import { DatastoreReducer, initialState } from './DatastoreReducer';
import env from '../env';

const useLegacyResults = env.REACT_APP_LEGACY_RESULTS;
const baseSearchUrl = useLegacyResults === 'true'
  ? `${env.REACT_APP_HEDIS_MEASURE_API_URL}measures/searchResults`
  : `${env.REACT_APP_HEDIS_MEASURE_API_URL}measures/dailyMeasureResults`;
const baseTrendUrl = `${env.REACT_APP_HEDIS_MEASURE_API_URL}measures/trends`;
const infoUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}measures/info`);
const payorsUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}payors`);
const healthcareProvidersUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}healthcareproviders`);
const healthcareCoveragesUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}healthcarecoverages`);
const practitionersUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}practitioners`);

const devData = `${env.REACT_APP_DEV_DATA}`;

export const DatastoreContext = createContext(initialState);

export default function DatastoreProvider({ children }) {
  const [datastore, dispatch] = useReducer(DatastoreReducer, initialState);
  const { measurementYear, refresh } = datastore;

  const datastoreActions = useMemo(() => ({
    setResults: (results, info) => dispatch({
      type: 'SET_RESULTS',
      payload: { results, info },
    }),

    setMemberResults: (memberResults) => dispatch({
      type: 'SET_MEMBER_RESULTS',
      payload: memberResults,
    }),

    setTrends: (trends) => dispatch({
      type: 'SET_TRENDS',
      payload: trends,
    }),

    setPreferences: (preferences) => dispatch({
      type: 'SET_PREFERENCES',
      payload: preferences,
    }),

    setHealthcareFilterOptions:
      (payors, healthcareProviders, healthcareCoverages, practitioners) => dispatch({
        type: 'SET_FILTER_OPTIONS',
        payload: {
          payors,
          healthcareProviders,
          healthcareCoverages,
          practitioners,
        },
      }),

    setIsLoading: (isLoading) => dispatch({
      type: 'SET_ISLOADING',
      payload: isLoading,
    }),

    setStatus: (status) => dispatch({
      type: 'SET_STATUS',
      payload: status,
    }),

    setMeasurementYear: (year) => dispatch({
      type: 'SET_MEASUREMENT_YEAR',
      payload: year,
    }),

    setComparisonMode: (mode) => dispatch({
      type: 'SET_COMPARISON_MODE',
      payload: { comparisonMode: mode },
    }),

    updateRefresh: () => dispatch({
      type: 'UPDATE_REFRESH',
    }),

  }), [dispatch]);

  const searchUrl = new URL(baseSearchUrl);
  searchUrl.searchParams.append('measurementYear', measurementYear);

  const trendUrl = new URL(baseTrendUrl);
  trendUrl.searchParams.append('measurementYear', measurementYear);
  trendUrl.searchParams.append('legacyResults', useLegacyResults);

  useEffect(() => {
    if (devData === 'true') {
      datastoreActions.setResults(resultList, infoObject);
      datastoreActions.setTrends(trendList);
      datastoreActions.setPreferences(userPreferences);
      datastoreActions.setIsLoading(true);
      datastoreActions.setStatus('200')
    } else if (measurementYear) {
      datastoreActions.setIsLoading(true);
      const trendPromise = axios.get(trendUrl);
      const searchPromise = axios.get(searchUrl);
      const infoPromise = axios.get(infoUrl);
      const payorsPromise = axios.get(payorsUrl);
      const healthcareProvidersPromise = axios.get(healthcareProvidersUrl);
      const healthcareCoveragesPromise = axios.get(healthcareCoveragesUrl);
      const practitionersPromise = axios.get(practitionersUrl);
      // this is placeholder preferences
      const newUserPreferences = {
        ratingTrends: widgetPrefs,
        theme: 'light',
      };

      Promise.all([
        searchPromise,
        infoPromise,
        payorsPromise,
        healthcareProvidersPromise,
        healthcareCoveragesPromise,
        practitionersPromise,
        trendPromise,
      ]).then((values) => {
        datastoreActions.setHealthcareFilterOptions(
          values[2].data.payors,
          values[3].data.healthcareProviders,
          values[4].data.healthcareCoverages,
          values[5].data.practitioner,
        );
        datastoreActions.setResults(values[0].data, values[1].data);
        datastoreActions.setTrends(values[6].data);
        // currently only front end default preferences
        datastoreActions.setPreferences(newUserPreferences);
        datastoreActions.setStatus(values[0].request.status)
      }).catch((error) => {
        datastoreActions.setStatus(error.request.status)
      });
    }
  }, [datastoreActions, measurementYear, refresh]);

  const reducerValue = useMemo(() => ({
    datastore, datastoreActions,
  }), [datastore, datastoreActions]);

  return (
    <DatastoreContext.Provider value={reducerValue}>
      {children}
    </DatastoreContext.Provider>
  );
}

DatastoreProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
