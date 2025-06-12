/* eslint-disable max-len */
import {
  useContext, useEffect, useState, useCallback,
} from 'react';
import {
  Box, Grid, Paper, Snackbar, Skeleton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DatastoreContext } from '../context/DatastoreProvider';
import { defaultActiveMeasure } from '../components/Utilities/PropTypes';

import theme from '../assets/styles/AppTheme';

import Banner from '../components/Common/Banner';
import Alert from '../components/Utilities/Alert';
import ChartContainer from '../components/Chart';
import DisplayTableContainer from '../components/DisplayTable/DisplayTableContainer';
import RatingTrends from '../components/Summary/RatingTrends';
import colorMapping from '../components/Utilities/ColorMapping';
import { headerData } from '../components/Utilities/MeasureTable';
import MemberTable from '../components/Utilities/MemberTable';
import Notification from '../components/Common/Notification';

// scrolly is a navigate function wrapped with scrollToTop
import { scrolly, scrollTop } from '../components/Utilities/ScrollNavigate';

import {
  calcMemberResults,
  displayDataFormatter,
  expandSubMeasureResults, filterByDOC,
  filterByPercentage,
  filterByStars,
  filterByTimeline,
  getSubMeasureCurrentResults,
} from '../components/Utilities/ChartUtils';

import {
  measureDataFetch,
  filterSearch,
} from '../components/Common/Controller';

export default function Dashboard() {
  const { datastore, datastoreActions } = useContext(DatastoreContext);
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
  const navigate = useNavigate();
  const [displayData, setDisplayData] = useState(
    datastore.results.map((result) => ({ ...result })),
  );
  const [isComposite, setIsComposite] = useState(true);
  const [currentResults, setCurrentResults] = useState([]);
  const [colorMap, setColorMap] = useState([]);
  const [selectedMeasures, setSelectedMeasures] = useState(Object.keys(
    () => Object.keys(datastore.info ?? {}),
  ));
  const [currentFilters, setCurrentFilters] = useState(datastore.defaultFilterState);
  const [additionalFilterOptions, setAdditionalFilterOptions] = useState({});
  const [currentTimeline, setCurrentTimeline] = useState(datastore.defaultTimelineState);
  const [graphWidth, setGraphWidth] = useState(window.innerWidth);
  const [filterDisabled, setFilterDisabled] = useState(true);
  const [tableFilter, setTableFilter] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [rowEntries, setRowEntries] = useState([]);
  const [tabValue, setTabValue] = useState('overview');
  const [chartData, setChartData] = useState([]);
  const { measure } = useParams();

  // Centralized loading state effect
  useEffect(() => {
    console.log('use effect 0')
    console.log('Datastore status:', datastore.status);
    console.log('Display data length:', displayData.length);
    console.log('Row entries length:', rowEntries.length);
    console.log('Tab value:', tabValue);
    console.log('No results found:', noResultsFound);
    console.log('isLoading:', isLoading);
    console.log('Current results length:', currentResults.length);
    console.log('Chart data before setting isloading:', chartData);
    if (
      (datastore.status === 'loading')
      || (displayData.length === 0 && !noResultsFound)
      || (tabValue === 'members' && rowEntries.length === 0 && !noResultsFound)
    ) {
      console.log('Setting isLoading to true in dashboard');
      setIsLoading(true);
    } else {
      console.log('Setting isLoading to false in dashboard');
      setIsLoading(false);
    }
  }, [datastore.status, displayData, rowEntries, tabValue, noResultsFound, chartData]);

  // CLEANS SLATE FUNCTION
  const handleResetData = (router) => {
    scrollTop();
    if (router === undefined) {
      setCurrentTimeline(datastore.defaultTimelineState);
      setCurrentFilters(datastore.defaultFilterState);
      setAdditionalFilterOptions(datastore.filterOptions);
      const ActiveMeasureTest = activeMeasure.measure === 'composite' || activeMeasure.measure === '';
      if (ActiveMeasureTest) {
        setFilterInfo({
          members: [],
          currentResults: [],
          displayData: [],
          results: [],
          filters: {},
        });
        setIsComposite(true);
        setDisplayData(datastore.results.map((result) => ({ ...result })));
        setCurrentResults(datastore.currentResults);
        setSelectedMeasures(Object.keys(datastore.info));
        setColorMap(colorMapping(datastore.currentResults));
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(true, datastore.comparisonMode));
      } else {
        setFilterInfo({
          members: [],
          currentResults: [],
          displayData: [],
          results: [],
          filters: {},
        });
        setIsComposite(false);
        const subMeasureCurrentResults = getSubMeasureCurrentResults(
          activeMeasure,
          datastore.currentResults,
          datastore.comparisonMode !== 'default',
        );
        setDisplayData(expandSubMeasureResults(activeMeasure, datastore.results, datastore.comparisonMode !== 'default'));
        setCurrentResults(subMeasureCurrentResults);
        setSelectedMeasures(subMeasureCurrentResults
          .map((result) => (datastore.comparisonMode === 'default' ? result.measure : result.comparisonItem)));
        setColorMap(
          colorMapping(datastore.currentResults, subMeasureCurrentResults),
        );
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(false, datastore.comparisonMode));
      }
      setFilterActivated(false);
      setNoResultsFound(false);
    } else if (router === 'all') {
      const otherMeasureFinder = filterInfo.results.filter(
        (res) => !res.measure.includes(measure),
      );
      if (otherMeasureFinder.length > 0) {
        if (filterInfo.members.length !== datastore.memberResults.length) {
          setCurrentResults(filterInfo.currentResults);
          setSelectedMeasures(filterInfo.currentResults
            .map((result) => (datastore.comparisonMode === 'default' ? result.measure : result.comparisonItem)));
          setDisplayData(filterInfo.results.map((result) => ({ ...result })));
        }
        setIsComposite(true);
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setColorMap(colorMapping(filterInfo.currentResults));
        setHeaderInfo(headerData(true, datastore.comparisonMode));
        scrolly(navigate, '/');
      } else {
        const isEmpty = (filter) => Object.keys(filter).length === 0;
        if (isEmpty(filterInfo.filters)) {
          setCurrentTimeline(datastore.defaultTimelineState);
          setCurrentFilters(datastore.defaultFilterState);
          scrolly(navigate, '/');
        } else {
          handleFilteredDataUpdate(currentFilters, filterInfo.timeline, 'GO BACK');
          scrolly(navigate, '/');
        }
      }
    }
  };

  // SETS ACTIVE MEASURE OBJECT
  useEffect(() => {
    console.log('use effect 1')
    // CURRENT RESULTS EXIST
    if (datastore.currentResults.length > 0) {
      const currentMeasure = measure || 'composite';
      setActiveMeasure(datastore.currentResults.find(
        (result) => result.measure === currentMeasure,
      ) || defaultActiveMeasure);
      handleFilteredDataUpdate(filterInfo.filters, filterInfo.timeline);
    }
  }, [datastore.currentResults, datastore.status, measure]);

  // CHART WINDOW RESIZING
  useEffect(() => {
    console.log('use effect 2')
    function handleResize() {
      setGraphWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // HANDLES FILTERING
  useEffect(() => {
    console.log('use effect 3')
    if (!filterActivated) {
      setCurrentTimeline(datastore.defaultTimelineState);
      setCurrentFilters(datastore.defaultFilterState);
      setAdditionalFilterOptions(datastore.filterOptions);
      const ActiveMeasureTest = activeMeasure.measure === 'composite' || activeMeasure.measure === '';
      if (ActiveMeasureTest) {
        setFilterInfo({
          members: [],
          currentResults: [],
          displayData: [],
          results: [],
          filters: {},
        });
        setIsComposite(true);
        setDisplayData(datastore.results.map((result) => ({ ...result })));
        setCurrentResults(datastore.currentResults);
        setSelectedMeasures(datastore.currentResults
          .map((result) => (datastore.comparisonMode === 'default' ? result.measure : result.comparisonItem)));
        setColorMap(colorMapping(datastore.currentResults, undefined, datastore.comparisonMode !== 'default'));
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(true, datastore.comparisonMode));
      } else {
        setFilterInfo({
          members: [],
          currentResults: [],
          displayData: [],
          results: [],
          filters: {},
        });
        setIsComposite(false);
        const subMeasureCurrentResults = getSubMeasureCurrentResults(
          activeMeasure,
          datastore.currentResults,
          datastore.comparisonMode !== 'default',
        );
        setDisplayData(expandSubMeasureResults(activeMeasure, datastore.results, datastore.comparisonMode !== 'default'));
        setCurrentResults(subMeasureCurrentResults);
        setSelectedMeasures(subMeasureCurrentResults
          .map((result) => (datastore.comparisonMode === 'default' ? result.measure : result.comparisonItem)));
        setColorMap(
          colorMapping(datastore.currentResults, subMeasureCurrentResults, datastore.comparisonMode !== 'default'),
        );
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(false, datastore.comparisonMode));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTableFilter, activeMeasure, isComposite, filterActivated]);

  // HANDLES ROW ENTRIES FOR COMPOSITE OR MEASURE VIEW
  useEffect(() => {
    console.log('use effect 4')
    if (tabValue === 'members') {
      setHeaderInfo(MemberTable.headerData(selectedMeasures, datastore.info));
      setRowEntries(MemberTable.formatData(
        datastore.memberResults,
        activeMeasure.measure,
        datastore.info,
        tableFilter,
      ));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datastore.memberResults]);

  // HANDLES FILTERING
  useEffect(() => {
    console.log('use effect 5')
    if (filterActivated) {
      setCurrentTimeline(filterInfo.timeline);
      setCurrentFilters(filterInfo.filters);
      setAdditionalFilterOptions(datastore.filterOptions);
      const ActiveMeasureTest = activeMeasure.measure === 'composite' || activeMeasure.measure === '';
      if (ActiveMeasureTest) {
        if (filterInfo.members.length !== datastore.memberResults.length) {
          setCurrentResults(filterInfo.currentResults);
          setSelectedMeasures(filterInfo.currentResults
            .map((result) => (datastore.comparisonMode === 'default' ? result.measure : result.comparisonItem)));
          setDisplayData(filterInfo.results.map((result) => ({ ...result })));
        }
        setIsComposite(true);
        setColorMap(colorMapping(filterInfo.currentResults, undefined, datastore.comparisonMode !== 'default'));
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(isComposite, datastore.comparisonMode));
      } else {
        setIsComposite(false);
        const subMeasureCurrentResults = getSubMeasureCurrentResults(
          activeMeasure,
          filterInfo.currentResults,
          datastore.comparisonMode !== 'default',
        );
        setDisplayData(expandSubMeasureResults(activeMeasure, filterInfo.results, datastore.comparisonMode !== 'default'));
        setCurrentResults(subMeasureCurrentResults);
        setSelectedMeasures(subMeasureCurrentResults
          .map((result) => (datastore.comparisonMode === 'default' ? result.measure : result.comparisonItem)));
        setColorMap(
          colorMapping(filterInfo.currentResults, subMeasureCurrentResults),
        );
        setFilterDisabled(false);
        setTableFilter([]);
        setHeaderInfo(headerData(false, datastore.comparisonMode));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setTableFilter,
    activeMeasure,
    isComposite,
    filterActivated,
    filterInfo,
  ]);

  // INITIAL FETCH DATA AND SET MEMBER RESULTS
  useEffect(() => {
    console.log('use effect 6')
    async function fetchData() {
      const records = await measureDataFetch(activeMeasure.measure);
      datastoreActions.setMemberResults(records);
    }
    // HANDLE COMPOSITE
    if (!isComposite) {
      // FILTERS EXIST
      if (filterInfo.members.length > 0) {
        // 120 IS THE TOTAL AND 15 IS THE EXPECTED AMOUNT
        const selectMemberResults = filterInfo.members
          .filter((result) => activeMeasure.measure.includes(result.measurementType));

        datastoreActions.setMemberResults(selectMemberResults);
      } else {
        // FILTERS DO NOT EXIST
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isComposite,
    filterInfo,
    activeMeasure.measure,
  ]);

  // INITIAL SETTING OF ROW ENTRIES
  useEffect(() => {
    console.log('use effect 7')
    setRowEntries(MemberTable.formatData(
      datastore.memberResults,
      activeMeasure.measure,
      datastore.info,
      tableFilter,
    ));
  }, [tableFilter, filterInfo, datastore.memberResults, activeMeasure.measure, datastore.info]);

  // HANDLES FILTERING ALSO BUT AGAIN
  useEffect(() => {
    console.log('use effect 8')
    const path = window.location.pathname;
    if (filterInfo.members.length > 0) {
      datastoreActions.setMemberResults(filterInfo.members);
    }

    if (path.includes('members')) {
      setHeaderInfo(MemberTable.headerData(selectedMeasures, datastore.info));
      const wantedMembers = datastore.memberResults;

      setRowEntries(MemberTable.formatData(
        wantedMembers,
        activeMeasure.measure,
        datastore.info,
        tableFilter,
      ));
      setIsComposite(false);
      setTabValue('members');
    } else {
      setTabValue('overview');
      setHeaderInfo(headerData(isComposite, datastore.comparisonMode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeMeasure.measure,
    selectedMeasures,
    datastore.info,
    tabValue,
    tableFilter,
  ]);

  // GENERATES CHART DATA AFTER PAGE LOAD
  const chartDataGenerator = useCallback(() => {
    const newChartData = displayDataFormatter(
      currentResults,
      selectedMeasures,
      displayData,
      colorMap,
      theme,
      datastore.comparisonMode !== 'default',
      datastore.measureAvgValue,
    );
    console.log('newChartData:', newChartData);
    if (newChartData.length > 1) {
      setChartData(newChartData);
    }
  }, [currentResults, selectedMeasures, datastore.comparisonMode, displayData]);

  useEffect(() => {
    setChartData([]);
    setIsLoading(true);
  }, [
    datastore.comparisonMode,
    datastore.measurementYear,
  ]);

  useEffect(() => {
    if (isLoading === false) {
      chartDataGenerator();
    }
  }, [isLoading, chartDataGenerator]);

  // HANDLES FILTERING
  const handleFilteredDataUpdate = async (filters, timeline, direction) => {
    if (Object.keys(filters).length === 0 && !timeline) {
      return;
    }
    const isComparisonMode = datastore.comparisonMode !== 'default';
    // Only set filter as activated if search panel criteria is selected
    const activateFilter = filterActivated
      || filters.healthcareCoverages.length > 0
      || filters.healthcarePractitioners.length > 0
      || filters.healthcareProviders.length > 0
      || filters.payors.length > 0
      || filters.domainsOfCare.length > 0
      || filters.stars.length > 0
      || filters.sum > 0;

    let cloneDailyMeasureResults = {};
    let cloneMembers = [];
    let searchResults = [];

    if (isComparisonMode) {
      cloneDailyMeasureResults = structuredClone(datastore.results);
    } else {
      const currentMeasureResolver = measure === undefined ? false : measure;
      if (direction === 'GO BACK') {
        searchResults = await filterSearch(
          false,
          datastore.measurementYear,
          filters,
          isComposite,
        );
      } else {
        searchResults = await filterSearch(
          currentMeasureResolver,
          datastore.measurementYear,
          filters,
          isComposite,
        );
      }
      cloneDailyMeasureResults = structuredClone(searchResults.dailyMeasureResults);
      cloneMembers = structuredClone(searchResults.members);
      if (filters.domainsOfCare.length > 0) {
        cloneDailyMeasureResults = filterByDOC(cloneDailyMeasureResults, filters, datastore.info);
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
    }

    cloneDailyMeasureResults = filterByTimeline(cloneDailyMeasureResults, timeline);
    if (cloneDailyMeasureResults.length > 0) {
      const calcResults = calcMemberResults(cloneDailyMeasureResults, datastore.info, datastore.comparisonMode !== 'default');
      const resultsByState = isComposite || direction === 'GO BACK'
        ? calcResults.results
        : expandSubMeasureResults(activeMeasure, calcResults.results, datastore.comparisonMode !== 'default');
      let filteredCurrentResults = {};
      if (datastore.comparisonMode !== 'default') {
        filteredCurrentResults = getSubMeasureCurrentResults(
          activeMeasure,
          calcResults.currentResults,
          datastore.comparisonMode !== 'default',
        );
      } else if (activeMeasure.measure === 'composite' || activeMeasure.measure === '' || direction === 'GO BACK') {
        filteredCurrentResults = calcResults.currentResults;
      } else {
        filteredCurrentResults = getSubMeasureCurrentResults(
          activeMeasure,
          calcResults.currentResults,
          datastore.comparisonMode !== 'default',
        );
      }
      const newFilterInfo = {
        members: cloneMembers,
        currentResults: filteredCurrentResults,
        results: resultsByState,
        filters,
        timeline,
      };
      setCurrentResults(newFilterInfo.currentResults);
      setSelectedMeasures(newFilterInfo.currentResults
        .map((result) => (datastore.comparisonMode === 'default' ? result.measure : result.comparisonItem)));
      setDisplayData(newFilterInfo.results.map((result) => ({ ...result })));
      setCurrentFilters(newFilterInfo.filters);
      setCurrentTimeline(newFilterInfo.timeline);
      setFilterInfo(newFilterInfo);
      if (direction) {
        setIsComposite(true);
      }
      setFilterActivated(activateFilter);
    } else {
      setNoResultsFound(true);
    }
  };

  // MEASURE CHANGE FUNCTION
  const handleSelectedMeasureChange = (selections) => {
    if (!tableFilter || tableFilter.length > 0) {
      setTableFilter([]);
    }
    if (selections.target?.name) {
      console.log('selections.target:', selections.target);
      navigate(`/${selections.target.name === 'composite' ? '' : selections.target.value}`);
    } else if (selectedMeasures.length !== selections.length) {
      setSelectedMeasures(selections);
    }
  };

  // TABLE FILTERING
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

  // TAB CHANGE HANDLER
  const handleTabChange = (_e, newValue) => {
    setTabValue(newValue);
    if (newValue === 'members' && datastore.comparisonMode === 'default') {
      navigate(`/${activeMeasure.measure}/members`);
      setHeaderInfo(MemberTable.headerData(selectedMeasures, datastore.info));
      setRowEntries(MemberTable.formatData(
        filterInfo.members.length > 0 ? filterInfo.members : datastore.memberResults,
        activeMeasure.measure,
        datastore.info,
        tableFilter,
      ));
    } else {
      console.log('activeMeasure:', activeMeasure);
      navigate(`/${activeMeasure.measure !== 'composite' ? activeMeasure.measure : ''}`);
      setHeaderInfo(headerData(isComposite, datastore.comparisonMode));
    }
  };

  return (
    <Box className="dashboard">
      <Notification
        status={datastore.status}
      />
      <Paper elevation={0} className="dashboard__paper">
        <Box sx={{ flexGrow: 2 }}>
          <Grid container spacing={4}>
            <Grid item className="dashboard__summary" sm={12}>
              <Banner
                headerText="HEDIS Dashboard"
                lastUpdated={datastore.lastUpdated}
                activeMeasure={activeMeasure}
                setIsLoading={setIsLoading}
                filterActivated={filterActivated}
                handleResetData={handleResetData}
              />
            </Grid>
            {!noResultsFound && (
              <Snackbar
                open={filterActivated}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message="Filters are active. To reset, click on 'RESET FILTERS' in the filter panel."
                sx={{
                  '& .MuiSnackbarContent-root': {
                    backgroundColor: theme.palette?.background.main,
                    color: theme.palette?.text.primary,
                  },
                }}
              />
            )}
            <Alert
              openAlert={noResultsFound}
              setOpenAlert={setNoResultsFound}
              title="NO RESULTS FOUND"
              noResultsAlert
              handleResetData={handleResetData}
              buttonText="Reset"
            >
              No results found. Please click button to reset the data to the initial results.
            </Alert>
            <Grid item xs={12}>
              <ChartContainer
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
                setIsComposite={setIsComposite}
                setTableFilter={setTableFilter}
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
                setRowEntries={setRowEntries}
                handleResetData={handleResetData}
                filterCurrentResultsLength={filterInfo.currentResults.length}
                chartData={chartData}
              />
            </Grid>
            {datastore.comparisonMode === 'default' && (
              <Grid item xs={12} className="rating-trends__container">
                {isLoading
                  ? <Skeleton variant="rectangular" height={200} />
                  : (
                    <RatingTrends
                      currentResults={datastore.currentResults}
                      activeMeasure={activeMeasure}
                      trends={datastore.trends}
                      widgetPrefs={datastore.preferences.ratingTrends}
                    />
                  )}
              </Grid>
            )}
            <Grid item xs={12}>
              <div className="chart-container">
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
                  handleTabChange={handleTabChange}
                  handleResetData={handleResetData}
                />
              </div>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
