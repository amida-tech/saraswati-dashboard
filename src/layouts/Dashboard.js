/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable brace-style */
/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
import {
  useContext, useEffect, useState, useCallback,
  useTransition,
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
import ColorMapping from '../components/Utilities/ColorMapping';
import { headerData } from '../components/Utilities/MeasureTable';
import MemberTable from '../components/Utilities/MemberTable';
import Notification from '../components/Common/Notification'

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
  infoDataFetch,
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
  const [isPending] = useTransition();
  const [activeMeasure, setActiveMeasure] = useState(defaultActiveMeasure);
  const navigate = useNavigate();
  const [displayData, setDisplayData] = useState(
    datastore.results.map((result) => ({ ...result })),
  );
  const [isComposite, setIsComposite] = useState(true);
  const [currentResults, setCurrentResults] = useState([]);
  const [colorMap, setColorMap] = useState([]);
  const [selectedMeasures, setSelectedMeasures] = useState(
    () => Object.keys(datastore.info ?? {}),
  );
  const [currentFilters, setCurrentFilters] = useState([]);
  const [additionalFilterOptions, setAdditionalFilterOptions] = useState([]);
  const [currentTimeline, setCurrentTimeline] = useState(datastore.defaultTimelineState);
  const [graphWidth, setGraphWidth] = useState(window.innerWidth);
  const [filterDisabled, setFilterDisabled] = useState(true);
  const [tableFilter, setTableFilter] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [rowEntries, setRowEntries] = useState([]);
  const [tabValue, setTabValue] = useState('overview');
  const [chartData, setChartData] = useState([]);
  const { measure } = useParams();

  // CLEANS SLATE FUNCTION
  const handleResetData = (router) => {
    scrollTop();
    datastoreActions.setComparisonMode('default');
    if (router === undefined) {
      setIsLoading(true);
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
        datastoreActions.setComparisonMode('default');
        setDisplayData(datastore.results.map((result) => ({ ...result })));
        setCurrentResults(datastore.currentResults);
        setSelectedMeasures(Object.keys(datastore.info));
        setColorMap(ColorMapping(datastore.currentResults));
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(true));
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
        );
        setDisplayData(expandSubMeasureResults(activeMeasure, datastore.results));
        setCurrentResults(subMeasureCurrentResults);
        setSelectedMeasures(subMeasureCurrentResults.map((result) => result.measure));
        setColorMap(
          ColorMapping(datastore.currentResults, subMeasureCurrentResults),
        );
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(false));
      }
      setFilterActivated(false);
      setNoResultsFound(false);
      setIsLoading(false);
    } else if (router === 'all') {
      const otherMeasureFinder = filterInfo.results.filter(
        (res) => !res.measure.includes(measure),
      );
      if (otherMeasureFinder.length > 0) {
        if (filterInfo.members.length !== datastore.memberResults.length) {
          setCurrentResults(filterInfo.currentResults);
          setSelectedMeasures(filterInfo.currentResults.map((result) => result.measure));
          setDisplayData(filterInfo.results.map((result) => ({ ...result })));
        }
        setIsComposite(true);
        datastoreActions.setComparisonMode('default');
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setColorMap(ColorMapping(filterInfo.currentResults));
        setHeaderInfo(headerData(true));
        scrolly(navigate, '/');
      } else {
        const isEmpty = (filter) => Object.keys(filter).length === 0;
        if (isEmpty(filterInfo.filters)) {
          setCurrentTimeline(datastore.defaultTimelineState);
          setCurrentFilters(datastore.defaultFilterState);
          scrolly(navigate, '/');
        } else {
          setIsLoading(true);
          handleFilteredDataUpdate(currentFilters, filterInfo.timeline, 'GO BACK');
          scrolly(navigate, '/');
        }
      }
    }
  };

  // SETS ACTIVE MEASURE OBJECT
  useEffect(() => {
    // CURRENT RESULTS EXIST
    if (datastore.currentResults.length > 0) {
      const currentMeasure = measure || 'composite';
      setActiveMeasure(datastore.currentResults.find(
        (result) => result.measure === currentMeasure,
      ) || defaultActiveMeasure);
      setIsLoading(datastore.datastoreLoading);
    }
  }, [datastore.currentResults, datastore.isLoading, datastore.status, measure]);

  // CHART WINDOW RESIZING
  useEffect(() => {
    function handleResize() {
      setGraphWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // HANDLES FILTERING
  useEffect(() => {
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
        datastoreActions.setComparisonMode('default');
        setDisplayData(datastore.results.map((result) => ({ ...result })));
        setCurrentResults(datastore.currentResults);
        setSelectedMeasures(datastore.currentResults.map((result) => result.measure));
        setColorMap(ColorMapping(datastore.currentResults));
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(true));
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
        );
        setDisplayData(expandSubMeasureResults(activeMeasure, datastore.results));
        setCurrentResults(subMeasureCurrentResults);
        setSelectedMeasures(subMeasureCurrentResults.map((result) => result.measure));
        setColorMap(
          ColorMapping(datastore.currentResults, subMeasureCurrentResults),
        );
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTableFilter, activeMeasure, isComposite, filterActivated]);

  // HANDLES ROW ENTRIES FOR COMPOSITE OR MEASURE VIEW
  useEffect(() => {
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
    if (filterActivated) {
      setCurrentTimeline(filterInfo.timeline);
      setCurrentFilters(filterInfo.filters);
      setAdditionalFilterOptions(datastore.filterOptions);
      const ActiveMeasureTest = activeMeasure.measure === 'composite' || activeMeasure.measure === '';
      if (ActiveMeasureTest) {
        if (filterInfo.members.length !== datastore.memberResults.length) {
          setCurrentResults(filterInfo.currentResults);
          setSelectedMeasures(filterInfo.currentResults.map((result) => result.measure));
          setDisplayData(filterInfo.results.map((result) => ({ ...result })));
        }
        setIsComposite(true);
        datastoreActions.setComparisonMode('default');
        setColorMap(ColorMapping(filterInfo.currentResults));
        setFilterDisabled(false);
        setTableFilter([]);
        setRowEntries([]);
        setHeaderInfo(headerData(isComposite));
      } else {
        setIsComposite(false);
        const subMeasureCurrentResults = getSubMeasureCurrentResults(
          activeMeasure,
          filterInfo.currentResults,
        );
        setDisplayData(expandSubMeasureResults(activeMeasure, filterInfo.results));
        setCurrentResults(subMeasureCurrentResults);
        setSelectedMeasures(subMeasureCurrentResults.map((result) => result.measure));
        setColorMap(
          ColorMapping(filterInfo.currentResults, subMeasureCurrentResults),
        );
        setFilterDisabled(false);
        setTableFilter([]);
        setHeaderInfo(headerData(false));
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
    async function fetchData() {
      const records = await measureDataFetch(activeMeasure.measure);
      datastoreActions.setMemberResults(records);
    }
    // HANDLE COMPOSITE
    if (!isComposite) {
      // FILTERS EXIST
      if (filterInfo.members.length > 0) {
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
    setRowEntries(MemberTable.formatData(
      datastore.memberResults,
      activeMeasure.measure,
      datastore.info,
      tableFilter,
    ));
  }, [tableFilter, filterInfo, datastore.memberResults, activeMeasure.measure, datastore.info]);

  // HANDLES FILTERING ALSO BUT AGAIN
  useEffect(() => {
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
      setHeaderInfo(headerData(isComposite));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeMeasure.measure,
    selectedMeasures,
    datastore.info,
    tabValue,
    tableFilter,
  ]);

  // useEffect(() => {
  // // only run when entering a real comparison mode
  //   if (!datastore.comparisonMode || datastore.comparisonMode === 'Default') {
  //     return;
  //   }

  //   let didCancel = false;
  //   const aliasObj = {
  //     payors: 'Payors',
  //     healthcareProviders: 'Providers',
  //     healthcareCoverages: 'Coverages',
  //     healthcarePractitioners: 'Practitioners',
  //   };

  //   async function loadComparisonData() {
  //     setIsLoading(true);
  //     const filterKey = Object.entries(aliasObj)
  //       .find(([, label]) => label === datastore.comparisonMode)?.[0];
  //     const items = filterKey ? (datastore.filterOptions[filterKey] || []) : [];
  //     const allResults = [];

  //     for (const item of items) {
  //       const search = await filterSearch(
  //         false,
  //         [item.value],
  //         isComposite,
  //         datastore.measurementYear,
  //       );
  //       allResults.push(
  //         ...search.dailyMeasureResults.map((r) => ({ ...r, measure: item.value })),
  //       );
  //     }

  //     if (!didCancel) {
  //       setCurrentResults(allResults);
  //       setDisplayData(allResults);
  //       setSelectedMeasures(items.map((i) => i.value));
  //       setIsLoading(false);
  //     }
  //   }

  //   loadComparisonData();

  //   // eslint-disable-next-line consistent-return
  //   return () => {
  //     didCancel = true;
  //   };
  // }, [
  //   datastore.comparisonMode,
  //   isComposite,
  //   datastore.measurementYear,
  // ]);

  // FORMATS DATA FOR CHART COMPONENT
  const chartDataGenerator = useCallback(() => {
    setIsLoading(true);
    let newChartData = [];

    if (datastore.comparisonMode && datastore.comparisonMode !== 'default') {
      newChartData = displayDataFormatter(
        currentResults,
        selectedMeasures,
        displayData,
        colorMap,
        theme,
        datastore.comparisonMode,
        datastore.filterOptions,
      );
    }
    else if (
      activeMeasure?.measure !== 'composite'
      && activeMeasure?.measure !== ''
    ) {
      const subScoreRows = datastore.results
        .filter((entry) => entry.measure === activeMeasure.measure
          && Array.isArray(entry.subScores)
          && entry.subScores.length > 0)
        .flatMap((entry) => entry.subScores.map((s) => ({
          ...s,
          date: entry.date || s.date,
        })));

      if (subScoreRows.length > 0) {
        const subNamesSet = new Set();
        const allDatesSet = new Set();
        subScoreRows.forEach((s) => {
          subNamesSet.add(s.measure);
          allDatesSet.add(s.date);
        });
        const subNames = Array.from(subNamesSet);
        const uniqueDates = Array.from(allDatesSet)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const subMap = {};
        subNames.forEach((sub) => { subMap[sub] = {}; });
        subScoreRows.forEach((s) => {
          subMap[s.measure][s.date] = s.value;
        });

        const mainMap = {};
        datastore.results
          .filter((e) => e.measure === activeMeasure.measure)
          .forEach((e) => {
            mainMap[e.date] = Number(e.value.toFixed(2));
          });

        const mainSeries = {
          name: activeMeasure.measure,
          color:
            colorMap.find((c) => c.value === activeMeasure.measure)?.color
            || theme.palette.primary.main,
          data: uniqueDates.map((date) => (typeof mainMap[date] === 'number'
            ? mainMap[date]
            : null)),
          dates: uniqueDates,
        };

        newChartData = [
          mainSeries,
          ...subNames.map((sub) => ({
            name: sub,
            color:
              colorMap.find((color) => color.value === sub)?.color
              || theme.palette.primary.main,
            data: uniqueDates.map((date) => (typeof subMap[sub][date] === 'number'
              ? Number(subMap[sub][date].toFixed(2))
              : null)),
            dates: uniqueDates,
          })),
        ];
      } else {
        const filtered = datastore.results.filter(
          (entry) => entry.measure === activeMeasure.measure,
        );
        const uniqueDates = [...new Set(filtered.map((e) => e.date))]
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const dateMap = {};
        filtered.forEach((e) => { dateMap[e.date] = e.value; });

        newChartData = [
          {
            name: activeMeasure.measure,
            color:
              colorMap.find((c) => c.value === activeMeasure.measure)?.color
              || theme.palette.primary.main,
            data: uniqueDates.map((date) => (typeof dateMap[date] === 'number'
              ? Number(dateMap[date].toFixed(2))
              : null)),
            dates: uniqueDates,
          },
        ];
      }
    } else if (
      Array.isArray(displayData)
        && displayData.length > 0
        && typeof displayData[0].measure === 'string'
        && typeof displayData[0].date === 'string'
    ) {
      const uniqueDates = [...new Set(displayData.map((e) => e.date))]
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const measureMap = {};
      displayData.forEach((entry) => {
        if (!measureMap[entry.measure]) measureMap[entry.measure] = {};
        measureMap[entry.measure][entry.date] = entry.value;
      });
      newChartData = Object.entries(measureMap).map(([meas, dateMap]) => ({
        name: meas,
        color: colorMap.find((c) => c.value === meas)?.color || theme.palette.primary.main,
        data: uniqueDates.map((date) => (typeof dateMap[date] === 'number'
          ? Number(dateMap[date].toFixed(2))
          : null)),
        dates: uniqueDates,
      }));
    } else {
      // just in super duper case while loading
      if (displayData.length !== 0) {
        console.warn('Unexpected results structure:', displayData);
        newChartData = [];
      }
    }

    setChartData(
      Array.isArray(newChartData) && newChartData.length > 0
        ? newChartData
        : [],
    );
    setIsLoading(false);
  }, [
    datastore.results,
    currentResults,
    displayData,
    selectedMeasures,
    colorMap,
    theme,
    datastore.comparisonMode,
    datastore.filterOptions,
    activeMeasure,
  ]);

  // GENERATES CHART DATA ONCE, WHEN LOADING COMPLETES
  useEffect(() => {
    chartDataGenerator();
  }, [chartDataGenerator]);

  // HANDLES FILTERING
  const handleFilteredDataUpdate = async (filters, timeline, direction) => {
    setIsLoading(true);

    // let newDisplayData
    let cloneDailyMeasureResults = {};
    let cloneMembers = [];
    let searchResults = [];

    const currentMeasureResolver = measure === undefined ? false : measure;
    const info = await infoDataFetch();

    const searchMeasParam = direction === 'GO BACK' ? false : currentMeasureResolver;
    searchResults = await filterSearch(
      searchMeasParam,
      filters,
      isComposite,
      datastore.measurementYear,
    );

    cloneDailyMeasureResults = structuredClone(searchResults.dailyMeasureResults);
    cloneMembers = structuredClone(searchResults.members);
    if (filters.domainsOfCare.length > 0) {
      cloneDailyMeasureResults = filterByDOC(cloneDailyMeasureResults, filters, info);
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
    cloneDailyMeasureResults = filterByTimeline(cloneDailyMeasureResults, timeline);
    if (cloneDailyMeasureResults.length > 0) {
      const calcResults = calcMemberResults(cloneDailyMeasureResults, info);
      const resultsByState = isComposite || direction === 'GO BACK'
        ? calcResults.results
        : expandSubMeasureResults(activeMeasure, calcResults.results);
      const newFilterInfo = {
        members: cloneMembers,
        currentResults: activeMeasure.measure === 'composite' || activeMeasure.measure === '' || direction === 'GO BACK'
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
      setSelectedMeasures(newFilterInfo.currentResults.map((result) => result.measure));
      setDisplayData(newFilterInfo.results.map((result) => ({ ...result })));
      setCurrentFilters(newFilterInfo.filters);
      setCurrentTimeline(newFilterInfo.timeline);
      setFilterInfo(newFilterInfo);
      if (direction) {
        setIsComposite(true);
        datastoreActions.setComparisonMode('default');
      }
      setFilterActivated(true);
    } else {
      setIsLoading(true);
      setNoResultsFound(true);
    }
    setIsLoading(false);
  };

  // MEASURE CHANGE FUNCTION
  const handleSelectedMeasureChange = (selections) => {
    if (!tableFilter || tableFilter.length > 0) {
      setTableFilter([]);
    }
    if (selections.target?.name) {
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
    if (newValue === 'members') {
      navigate(`/${activeMeasure.measure}/members`);
      setHeaderInfo(MemberTable.headerData(selectedMeasures, datastore.info));
      setRowEntries(MemberTable.formatData(
        filterInfo.members.length > 0 ? filterInfo.members : datastore.memberResults,
        activeMeasure.measure,
        datastore.info,
        tableFilter,
      ));
    } else {
      navigate(`/${activeMeasure.measure}`);
      setHeaderInfo(headerData(isComposite));
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
                handleResetData={handleResetData}
                setIsLoading={setIsLoading}
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
              { (isLoading || isPending) || noResultsFound
                ? <Skeleton variant="rectangular" height={500} />
                : (
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
                    graphWidth={graphWidth}
                    setFilterActivated={setFilterActivated}
                    setIsLoading={setIsLoading}
                    setRowEntries={setRowEntries}
                    handleResetData={handleResetData}
                    setFilterInfo={setFilterInfo}
                    filterCurrentResultsLength={filterInfo.currentResults.length}
                    chartData={chartData}
                  />
                )}
            </Grid>
            <Grid item xs={12} className="rating-trends__container">
              { isLoading
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
            <Grid item xs={12}>
              { isLoading || (datastore.comparisonMode !== 'default')
                ? <div />
                : (
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
                )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
