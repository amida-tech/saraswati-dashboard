/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import { Grid, Skeleton, Typography } from '@mui/material';
import { createContext, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';

import { DatastoreContext } from '../../context/DatastoreProvider';
import theme from '../../assets/styles/AppTheme';

import FilterDrawer from '../FilterMenu/FilterDrawer';
import ChartBar from './ChartBar';
import ChartHeader from './ChartHeader';
import { lineChartOptions } from '../Utilities/ChartUtils';

import {
  activeMeasureProps,
  defaultActiveMeasure,
  filterDrawerOpenProps,
  toggleFilterDrawerProps,
  handleFilteredDataUpdateProps,
  setCurrentFiltersProps,
  currentTimelineProps,
  currentFiltersProps,
  setCurrentTimelineProps,
  isCompositeProps,
  setIsCompositeProps,
  setTableFilterProps,
  currentResultsProps,
  filterDisabledProps,
  colorMapProps,
  handleResetDataProps,
  setRowEntriesProps,
  setTabValueProps,
  setFilterActivatedProps,
  additionalFilterOptionsProps,
  chartDataProps,
} from '../Utilities/PropTypes';
import { comparisonModeLabels } from './ComparisonSelector';

export const firstRenderContext = createContext(true);

function labelGenerator(measure) {
  if (!measure?.label) {
    return '';
  }
  const { label } = measure;
  return (
    <Grid sx={{ color: theme.palette?.bluegray.D4 }} className="chart-container__return-measure-labels">
      <Typography className="chart-container__return-measure-title">{label.indexOf(' ') >= 0 ? label.substring(0, label.indexOf(' ')) : label}</Typography>
      <Typography className="chart-container__return-measure-description">{label.indexOf('- ') >= 0 ? label.substring(label.indexOf('- ') + 1) : ''}</Typography>
    </Grid>
  );
}

function ChartContainer({
  // basic data props
  isComposite,
  activeMeasure,
  currentResults,
  currentTimeline,
  currentFilters,
  chartData,
  colorMap,
  // filter props
  filterDrawerOpen,
  filterDisabled,
  additionalFilterOptions,
  // handlers
  toggleFilterDrawer,
  handleFilteredDataUpdate,
  handleResetData,
  // setters
  setIsComposite,
  setTableFilter,
  setTabValue,
  setRowEntries,
  setCurrentFilters,
  setFilterActivated,
  setCurrentTimeline,
}) {
  const {
    datastore: { comparisonMode, comparisonYear, isLoading },
  } = useContext(DatastoreContext)

  // there's a few considerations for this component
  // ideally, dashboard is broken up a bit more, state is simplified, useeffects are simplified
  // but a full blown refactor doesn't seem like a great idea right now... yet we need the data to fit
  // nicely in this apex chart... I have settled on leet coding conditionals in here for now

  // the chart has the following states for consideration:
  // loading (initial page loading)
  // loading (between default/comparison/year modes)
  // default composite data
  // default measure data
  // comparison composite data
  // comparison measure data
  // partial data for the above four states (when a user makes selections)
  // no measures are selected AND yet we are not in a loading state (either initial load or between modes)

  // feel free to argue any of this is bad practice, but I am trying to keep the logic in one place
  // and maybe some explanation of what is going on here

  const labelObj = comparisonModeLabels.find(
    (c) => c.value.toLowerCase() === comparisonMode.toLowerCase(),
  )

  const chartHeader = comparisonMode.toLowerCase() !== 'default'
    ? labelObj?.single || labelObj?.label || ''
    : !isComposite
      ? 'Sub-Measure'
      : 'Measure'

  const handleFilterChange = (filterOptions) => {
    setCurrentFilters(filterOptions);
    handleFilteredDataUpdate(filterOptions, currentTimeline);
  };
  const handleTimelineChange = (timelineUpdate) => {
    setCurrentTimeline(timelineUpdate);
    handleFilteredDataUpdate(currentFilters, timelineUpdate);
  };

  // If the chartData is empty, we want to show a loading skeleton
  // or if the chartData has only one entry and that entry is 'MY2024 Composite Average'
  // but also prune out any weird multiple 'composite' entries from the chartData from mishandled loading state
  // todo: figure out why this happens
  if (isLoading
    || chartData === undefined
    || (chartData.slice(1).every((o) => o.name === 'composite')
    || chartData.filter((o) => o.name === 'composite').length > 1)
    || (chartData.length === 1 && chartData[0]?.name === 'MY2024 Composite Average')) {
    return (<Skeleton variant="rectangular" height={500} />);
  }

  return (
    <div className="chart-container">
      <FilterDrawer
        filterDrawerOpen={filterDrawerOpen}
        toggleFilterDrawer={toggleFilterDrawer}
        currentFilters={currentFilters}
        handleFilterChange={handleFilterChange}
        additionalFilterOptions={additionalFilterOptions}
        setFilterActivated={setFilterActivated}
        setIsComposite={setIsComposite}
        setTableFilter={setTableFilter}
        setRowEntries={setRowEntries}
        handleResetData={handleResetData}
      />
      <ChartHeader
        isComposite={isComposite}
        setIsComposite={setIsComposite}
        setTabValue={setTabValue}
        setTableFilter={setTableFilter}
        isLoading={isLoading}
        handleResetData={handleResetData}
        labelGenerator={labelGenerator}
        currentResults={currentResults}
        activeMeasure={activeMeasure}
      />
      <Grid className="chart-container__main-chart">
        <Grid item className="chart-container__chart-bar">
          <ChartBar
            filterDrawerOpen={filterDrawerOpen}
            toggleFilterDrawer={toggleFilterDrawer}
            currentTimeline={currentTimeline}
            handleTimelineChange={handleTimelineChange}
            filterSum={currentFilters.sum}
            filterDisabled={filterDisabled}
          />
        </Grid>
        <Grid item className="chart-container__chart">
          <ReactApexChart
            key={`${comparisonMode}-${comparisonYear}`}
            options={lineChartOptions(
              {
                colorMap,
                currentTimeline,
                chartData,
                theme,
                chartHeader,
                showChartWithNoDataMessage: (!isLoading && !chartData),
              },
            )}
            series={chartData}
            type="line"
            width="100%"
            height="100%"
          />

        </Grid>

      </Grid>
    </div>
  );
}

ChartContainer.propTypes = {
  activeMeasure: activeMeasureProps,
  filterDrawerOpen: filterDrawerOpenProps,
  toggleFilterDrawer: toggleFilterDrawerProps,
  handleFilteredDataUpdate: handleFilteredDataUpdateProps,
  setCurrentFilters: setCurrentFiltersProps,
  currentTimeline: currentTimelineProps,
  currentFilters: currentFiltersProps,
  setCurrentTimeline: setCurrentTimelineProps,
  isComposite: isCompositeProps,
  setIsComposite: setIsCompositeProps,
  setTableFilter: setTableFilterProps,
  currentResults: currentResultsProps,
  filterDisabled: filterDisabledProps,
  colorMap: colorMapProps,
  setFilterActivated: setFilterActivatedProps,
  additionalFilterOptions: additionalFilterOptionsProps,
  setRowEntries: setRowEntriesProps,
  handleResetData: handleResetDataProps,
  setTabValue: setTabValueProps,
  chartData: chartDataProps,
};

ChartContainer.defaultProps = {
  activeMeasure: defaultActiveMeasure,
  filterDrawerOpen: false,
  toggleFilterDrawer: false,
  handleFilteredDataUpdate: () => undefined,
  setCurrentFilters: () => undefined,
  currentTimeline: [],
  currentFilters: [],
  setCurrentTimeline: () => undefined,
  isComposite: true,
  setIsComposite: () => undefined,
  setTableFilter: () => undefined,
  currentResults: [],
  filterDisabled: true,
  colorMap: [],
  setFilterActivated: () => undefined,
  additionalFilterOptions: {},
  setRowEntries: () => undefined,
  handleResetData: () => undefined,
  setTabValue: () => undefined,
  chartData: [],
};

export default ChartContainer;
