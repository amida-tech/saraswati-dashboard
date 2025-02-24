import { Snackbar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import {
  calcMemberResults,
  expandSubMeasureResults,
  filterByDOC,
  filterByPercentage,
  filterByStars,
  filterByTimeline,
  getSubMeasureCurrentResults,
} from '../components/ChartContainer/D3ContainerUtils';
import { DatastoreContext, useDatastoreContext } from '../context/DatastoreProvider';
import { defaultActiveMeasure } from '../components/ChartContainer/D3Props';
import {
  measureDataFetch,
  filterSearch,
  infoDataFetch,
} from '../components/Common/Controller';
import Alert from '../components/Utilities/Alert';
import Banner from '../components/Common/Banner';
import ColorMapping from '../components/Utilities/ColorMapping';
import D3Container from '../components/ChartContainer';
import DisplayTableContainer from '../components/DisplayTable/DisplayTableContainer';
import MeasureTable from '../components/Utilities/MeasureTable';
import MemberTable from '../components/Utilities/MemberTable';
import RatingTrends from '../components/Summary/RatingTrends';
import styles from './Dashboard.module.css';

const chartColorArray = [
  '#88CCEE',
  '#CC6677',
  '#DDCC77',
  '#117733',
  '#332288',
  '#AA4499',
  '#44AA99',
  '#999933',
  '#661100',
  '#6699CC',
  '#888888',
];

export default function Dashboard() {
  const { datastore } = useDatastoreContext();
  const [filterDrawerOpen, toggleFilterDrawer] = useState(false);
  const [filterActivated, setFilterActivated] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [filterInfo, setFilterInfo] = useState({
    members: [],
    currentResults: [],
    displayData: [],
    results: [],
    filters: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeMeasure, setActiveMeasure] = useState(defaultActiveMeasure);
  const history = useHistory();
  const [displayData, setDisplayData] = useState(
    datastore?.results.map((result) => ({ ...result })),
  );
  const [isComposite, setComposite] = useState(true);
  const [currentResults, setCurrentResults] = useState([]);
  const [colorMap, setColorMap] = useState([]);
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const [currentFilters, setCurrentFilters] = useState([]);
  const [additionalFilterOptions, setAdditionalFilterOptions] = useState([]);
  const [currentTimeline, setCurrentTimeline] = useState(
    datastore?.defaultTimelineState,
  );
  const [graphWidth, setGraphWidth] = useState(window.innerWidth);
  const [filterDisabled, setFilterDisabled] = useState(true);
  const [memberResults, setMemberResults] = useState([]);
  const [tableFilter, setTableFilter] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [rowEntries, setRowEntries] = useState([]);
  const [tabValue, setTabValue] = useState('overview');
  const { measure } = useParams();

  // Function that initiializes filter information
  function initializeFilterInfo() {
    return {
      members: [],
      currentResults: [],
      displayData: [],
      results: [],
      filters: {},
    };
  }

  // Function that resets states based on measure type (composite or not)
  function resetStatesForMeasure(
    isComposite,
    datastore,
    activeMeasure,
    baseColorMap,
  ) {
    // Initialize filter information
    setFilterInfo(initializeFilterInfo());
    // Set composite data boolean
    setComposite(isComposite);
    // Based on isComposite (measure type), determines currentResults
    const currentResults = isComposite
      ? datastore?.currentResults
      : getSubMeasureCurrentResults(activeMeasure, datastore?.currentResults);
    // Based on isComposite (measure type), determines displayData
    const displayData = isComposite
      ? datastore?.results.map((result) => ({ ...result }))
      : expandSubMeasureResults(activeMeasure, datastore?.results);
    // Extracts measures from the currentResults
    const selectedMeasures = currentResults?.map((result) => result.measure);
    // Based on isComposite (measure type), generates colorMape
    const colorMap = isComposite
      ? baseColorMap
      : ColorMapping(baseColorMap, datastore?.chartColorArray, currentResults);
    // Updates state with determined values
    setDisplayData(displayData);
    setCurrentResults(currentResults);
    setSelectedMeasures(selectedMeasures);
    setColorMap(colorMap);
    // Enables filters and resets table filters and row entries
    setFilterDisabled(false);
    setTableFilter([]);
    setRowEntries([]);
    // Based on isComposite, updates the header information
    setHeaderInfo(MeasureTable.headerData(isComposite));
  }

  const handleResetData = (router) => {
    const baseColorMap = datastore?.currentResults?.map((item, index) => ({
      value: item.measure,
      color: index <= 11 ? chartColorArray[index] : chartColorArray[index % 11],
    }));
    if (router === undefined) {
      // Changes isLoading to true
      setIsLoading(true);

      // Sets the default timeline, filter states, and filter options
      setCurrentTimeline(datastore?.defaultTimelineState);
      setCurrentFilters(datastore?.defaultFilterState);
      setAdditionalFilterOptions(datastore?.filterOptions);

      // Determines if the active measure is composite or not
      const isCompositeMeasure = activeMeasure.measure === 'composite' || activeMeasure.measure === '';

      // Reset state for isCompositeMeasure, datastore, activeMeasure, & baseColorMap
      resetStatesForMeasure(
        isCompositeMeasure,
        datastore,
        activeMeasure,
        baseColorMap,
      );
      // Changes filterActivated to false
      setFilterActivated(false);
      // Changes noResultsFound to false
      setNoResultsFound(false);
      // Changes isLoading to false
      setIsLoading(false);
    } else if (router === 'ALL MEASURES') {
      const otherMeasureFinder = filterInfo.results.filter(
        (res) => !res.measure.includes(measure),
      );
      if (otherMeasureFinder.length > 0) {
        if (filterInfo.members.length !== memberResults.length) {
          setCurrentResults(filterInfo.currentResults);
          setSelectedMeasures(
            filterInfo.currentResults?.map((result) => result.measure),
          );
          setDisplayData(filterInfo.results.map((result) => ({ ...result })));
        }
        setComposite(true);
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setColorMap(baseColorMap);
        setHeaderInfo(MeasureTable.headerData(true));
        history.push('/');
      } else {
        const isEmpty = (filter) => Object.keys(filter).length === 0;
        if (isEmpty(filterInfo.filters)) {
          setCurrentTimeline(datastore?.defaultTimelineState);
          setCurrentFilters(datastore?.defaultFilterState);
          history.push('/');
        } else {
          setIsLoading(true);
          handleFilteredDataUpdate(
            currentFilters,
            filterInfo.timeline,
            'GO BACK',
          );
          history.push('/');
        }
      }
    }
  };
  useEffect(() => {
    // CURRENT RESULTS EXIST
    if (datastore?.currentResults) {
      const currentMeasure = measure || 'composite';
      setActiveMeasure(
        datastore?.currentResults?.find(
          (result) => result.measure === currentMeasure,
        ) || defaultActiveMeasure,
      );
      setIsLoading(datastore?.datastoreLoading);
    } else {
      // NO CURRENT RESULTS
    }
  }, [datastore?.currentResults, datastore?.datastoreLoading, measure]);

  useEffect(() => {
    function handleResize() {
      setGraphWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    if (!filterActivated) {
      const baseColorMap = datastore?.currentResults?.map((item, index) => ({
        value: item.measure,
        color:
          index <= 11 ? chartColorArray[index] : chartColorArray[index % 11],
      }));
      // Sets the default timeline, filter states, and filter options
      setCurrentTimeline(datastore?.defaultTimelineState);
      setCurrentFilters(datastore?.defaultFilterState);
      setAdditionalFilterOptions(datastore?.filterOptions);

      // Determines if the active measure is composite or not
      const isCompositeMeasure = activeMeasure.measure === 'composite' || activeMeasure.measure === '';

      // Reset state for isCompositeMeasure, datastore, activeMeasure, & baseColorMap
      resetStatesForMeasure(
        isCompositeMeasure,
        datastore,
        activeMeasure,
        baseColorMap,
      );
    }
  }, [
    setTableFilter,
    history,
    activeMeasure,
    isComposite,
    datastore,
    filterActivated,
  ]);

  useEffect(() => {
    if (filterActivated) {
      const baseColorMap = datastore?.currentResults?.map((item, index) => ({
        value: item.measure,
        color:
          index <= 11 ? chartColorArray[index] : chartColorArray[index % 11],
      }));
      setCurrentTimeline(filterInfo.timeline);
      setCurrentFilters(filterInfo.filters);
      setAdditionalFilterOptions(datastore?.filterOptions);
      const ActiveMeasureTest = activeMeasure.measure === 'composite' || activeMeasure.measure === '';
      if (ActiveMeasureTest) {
        if (filterInfo.members.length !== memberResults.length) {
          setCurrentResults(filterInfo.currentResults);
          setSelectedMeasures(
            filterInfo.currentResults?.map((result) => result.measure),
          );
          setDisplayData(filterInfo.results.map((result) => ({ ...result })));
        }
        setComposite(true);
        setColorMap(baseColorMap);
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(MeasureTable.headerData(true));
      } else {
        setComposite(false);
        const subMeasureCurrentResults = getSubMeasureCurrentResults(
          activeMeasure,
          filterInfo.currentResults,
        );
        setDisplayData(
          expandSubMeasureResults(activeMeasure, filterInfo.results),
        );
        setCurrentResults(subMeasureCurrentResults);
        setSelectedMeasures(
          subMeasureCurrentResults.map((result) => result.measure),
        );
        setColorMap(
          ColorMapping(
            baseColorMap,
            datastore?.chartColorArray,
            subMeasureCurrentResults,
          ),
        );
        setFilterDisabled(false);
        setTableFilter([]);
        setHeaderInfo(MeasureTable.headerData(false));
      }
    }
  }, [
    setTableFilter,
    history,
    activeMeasure,
    isComposite,
    datastore,
    filterActivated,
    filterInfo,
    memberResults,
  ]);

  useEffect(() => {
    async function fetchData() {
      const records = await measureDataFetch(activeMeasure.measure);
      setMemberResults(records);
    }
    // HANDLE COMPOSITE
    if (!isComposite) {
      // FILTERS EXIST
      if (filterInfo.members.length > 0) {
        // 120 IS THE TOTAL AND 15 IS THE EXPECTED AMOUNT
        const selectMemberResults = filterInfo.members.filter((result) => activeMeasure.measure.includes(result.measurementType));

        setMemberResults(selectMemberResults);
      } else {
        // FILTERS DO NOT EXIST
        fetchData();
      }
    }
  }, [isComposite, filterInfo, activeMeasure.measure, setMemberResults]);

  useEffect(() => {
    setRowEntries(
      MemberTable.formatData(
        filterInfo.members.length > 0 ? filterInfo.members : memberResults,
        activeMeasure.measure,
        datastore?.info,
        tableFilter,
      ),
    );
  }, [
    tableFilter,
    filterInfo,
    memberResults,
    activeMeasure.measure,
    datastore?.info,
  ]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('members')) {
      setHeaderInfo(MemberTable.headerData(selectedMeasures, datastore?.info));
      const wantedMembers = filterInfo.members.length > 0 ? filterInfo.members : memberResults;
      setRowEntries(
        MemberTable.formatData(
          wantedMembers,
          activeMeasure.measure,
          datastore?.info,
          tableFilter,
        ),
      );
      setComposite(false);
      setTabValue('members');
    } else if (path === '/') {
      setTabValue('overview');
    } else {
      setTabValue('overview');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeMeasure.measure,
    memberResults,
    selectedMeasures,
    datastore?.info,
    tabValue,
    tableFilter,
  ]);

  // If control needs to be shared across multiple components,
  // add them through useState above and append them to these.

  // THIS NEEDS ROWENTRIES TO BE MODIFIED

  const handleFilteredDataUpdate = async (filters, timeline, direction) => {
    setIsLoading(true);
    // let newDisplayData
    let cloneDailyMeasureResults = {};
    let cloneMembers = [];
    let searchResults = [];
    const currentMeasureResolver = measure === undefined ? false : measure;
    const info = await infoDataFetch();
    if (direction === 'GO BACK') {
      searchResults = await filterSearch(false, filters);
    } else {
      searchResults = await filterSearch(currentMeasureResolver, filters);
    }
    cloneDailyMeasureResults = structuredClone(
      searchResults.dailyMeasureResults,
    );
    cloneMembers = structuredClone(searchResults.members);
    if (filters.domainsOfCare.length > 0) {
      cloneDailyMeasureResults = filterByDOC(
        cloneDailyMeasureResults,
        filters,
        info,
      );
    }
    if (filters.stars.length > 0) {
      cloneDailyMeasureResults = filterByStars(
        cloneDailyMeasureResults,
        filters,
        cloneDailyMeasureResults,
      );
    }
    if (filters.percentRange[0] > 0 || filters.percentRange[1] < 100) {
      cloneDailyMeasureResults = filterByPercentage(
        cloneDailyMeasureResults,
        filters,
        cloneDailyMeasureResults,
      );
    }
    cloneDailyMeasureResults = filterByTimeline(
      cloneDailyMeasureResults,
      timeline,
    );
    if (cloneDailyMeasureResults.length > 0) {
      const calcResults = calcMemberResults(cloneDailyMeasureResults, info);
      const resultsByState = isComposite || direction === 'GO BACK'
        ? calcResults.results
        : expandSubMeasureResults(activeMeasure, calcResults.results);
      const newFilterInfo = {
        members: cloneMembers,
        currentResults:
          activeMeasure.measure === 'composite'
          || activeMeasure.measure === ''
          || direction === 'GO BACK'
            ? calcResults.currentResults
            : getSubMeasureCurrentResults(
              activeMeasure,
              calcResults.currentResults,
            ),
        results: resultsByState,
        filters,
        timeline,
      };
      setCurrentResults(newFilterInfo.currentResults);
      setSelectedMeasures(
        newFilterInfo.currentResults?.map((result) => result.measure),
      );
      setDisplayData(newFilterInfo.results.map((result) => ({ ...result })));
      setCurrentFilters(newFilterInfo.filters);
      setCurrentTimeline(newFilterInfo.timeline);
      setFilterInfo(newFilterInfo);
      if (direction) {
        setComposite(true);
      }
      setFilterActivated(true);
    } else {
      setIsLoading(true);
      setNoResultsFound(true);
    }
    setIsLoading(false);
  };

  const handleSelectedMeasureChange = (event) => {
    setTableFilter([]);
    let newSelectedMeasures;
    if (event.target.checked) {
      newSelectedMeasures = event.target.value === 'all'
        ? currentResults?.map((result) => result.measure)
        : selectedMeasures.concat(event.target.value);
      setSelectedMeasures(newSelectedMeasures);
    } else {
      newSelectedMeasures = event.target.value === 'all'
        ? []
        : selectedMeasures.filter((result) => result !== event.target.value);
      setSelectedMeasures(newSelectedMeasures);
    }
    const MeasureSelectorCheck = event.target.name === 'Select Measure';
    if (MeasureSelectorCheck) {
      history.push(
        `/${event.target.value === 'composite' ? '' : event.target.value}`,
      );
    }
  };

  const handleTableFilterChange = (event) => {
    if (event.target.value === undefined) {
      setTableFilter([]);
    } else if (tableFilter.includes(event.target.value)) {
      const tableFilterIndex = tableFilter.indexOf(event.target.value);
      const newFiltering = tableFilter.filter((_, i) => i !== tableFilterIndex);

      setTableFilter(newFiltering);
    } else {
      const newFiltering = [...tableFilter, event.target.value];

      setTableFilter(newFiltering);
    }
  };

  const handleTabChange = (_e, newValue) => {
    setTabValue(newValue);
    if (newValue === 'members') {
      history.push(`/${activeMeasure.measure}/members`);
      setHeaderInfo(MemberTable.headerData(selectedMeasures, datastore?.info));
      setRowEntries(
        MemberTable.formatData(
          filterInfo.members.length > 0 ? filterInfo.members : memberResults,
          activeMeasure.measure,
          datastore?.info,
          tableFilter,
        ),
      );
    } else {
      history.push(`/${activeMeasure.measure}`);
      setHeaderInfo(MeasureTable.headerData(isComposite));
    }
  };
  return (
    <Box className={styles.dashboard}>
      <Box>
        <Grid container spacing={0} sx={{}}>
          {/* HEDIS Dashboard Banner */}
          <div className={styles.dashboardContent}>
            <Grid item className="dashboard__summary" sm={12}>
              <Banner
                headerText="HEDIS Dashboard"
                lastUpdated={datastore?.lastUpdated}
              />
            </Grid>

            {/* Ratings & Trends */}
            <Grid item xs={12}>
              {isLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <RatingTrends
                  activeMeasure={activeMeasure}
                  trends={datastore?.trends}
                  info={datastore?.info}
                />
              )}
            </Grid>

            {/* Nothing found, no results found Snackbar */}
            {!noResultsFound && (
              <Snackbar
                open={filterActivated}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message="Filters are active. To reset, click on 'RESET FILTERS' in the filter panel."
                sx={{
                  '& .MuiSnackbarContent-root': {
                    backgroundColor: '#DFF4FC',
                    color: '#0E3D73',
                  },
                }}
              />
            )}
            {/* Alert - no results found */}
            <Alert
              openAlert={noResultsFound}
              setOpenAlert={setNoResultsFound}
              title="NO RESULTS FOUND"
              noResultsALERT
              handleResetData={handleResetData}
            >
              No results found. Please click button to reset the data to the
              initial results.
              {/* <div
                style={{
                  fontSize: '2rem',
                  width: '100%',
                  textAlign: 'center',
                  marginTop: '1rem',
                }}
              >
                (^-^)
              </div> */}
            </Alert>
            {/* All Measures Graph */}
            <Grid item xs={12}>
              {isLoading || noResultsFound ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <D3Container
                  additionalFilterOptions={additionalFilterOptions}
                  setCurrentFilters={setCurrentFilters}
                  selectedMeasures={selectedMeasures}
                  currentTimeline={currentTimeline}
                  currentFilters={currentFilters}
                  handleFilteredDataUpdate={handleFilteredDataUpdate}
                  setCurrentTimeline={setCurrentTimeline}
                  filterDrawerOpen={filterDrawerOpen}
                  toggleFilterDrawer={toggleFilterDrawer}
                  isComposite={isComposite}
                  setComposite={setComposite}
                  setTableFilter={setTableFilter}
                  history={history}
                  isLoading={isLoading}
                  currentResults={currentResults}
                  setTabValue={setTabValue}
                  activeMeasure={activeMeasure}
                  filterDisabled={filterDisabled}
                  displayData={displayData}
                  colorMap={colorMap}
                  store={datastore}
                  graphWidth={graphWidth}
                  setFilterActivated={setFilterActivated}
                  setIsLoading={setIsLoading}
                  setMemberResults={setMemberResults}
                  setRowEntries={setRowEntries}
                  handleResetData={handleResetData}
                  setFilterInfo={setFilterInfo}
                  filterCurrentResultsLength={filterInfo.currentResults?.length}
                />
              )}
            </Grid>
            {/* Overview/Members display table */}
            <Grid item xs={12}>
              {isLoading ? (
                <Skeleton variant="rectangular" height={500} />
              ) : (
                <div className="d3-container">
                  <DisplayTableContainer
                    activeMeasure={activeMeasure}
                    store={datastore}
                    tabValue={tabValue}
                    isComposite={isComposite}
                    headerInfo={headerInfo}
                    handleSelectedMeasureChange={handleSelectedMeasureChange}
                    selectedMeasures={selectedMeasures}
                    currentResults={currentResults}
                    colorMap={colorMap}
                    tableFilter={tableFilter}
                    handleTableFilterChange={handleTableFilterChange}
                    rowEntries={rowEntries}
                    setTableFilter={setTableFilter}
                    handleTabChange={handleTabChange}
                  />
                </div>
              )}
            </Grid>
          </div>
        </Grid>
      </Box>
    </Box>
  );
}
