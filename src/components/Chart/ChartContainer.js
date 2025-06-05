/* eslint-disable no-nested-ternary */
import { Grid, Typography } from '@mui/material';
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
  isLoadingProps,
  handleFilteredDataUpdateProps,
  setCurrentFiltersProps,
  currentTimelineProps,
  currentFiltersProps,
  setCurrentTimelineProps,
  isCompositeProps,
  setCompositeProps,
  setTableFilterProps,
  currentResultsProps,
  filterDisabledProps,
  colorMapProps,
  handleResetDataProps,
  setRowEntriesProps,
  setTabValueProps,
  setFilterActivatedProps,
  setIsLoadingProps,
  additionalFilterOptionsProps,
  setFilterInfoProps,
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
  isLoading,
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
  setComposite,
  setTableFilter,
  setTabValue,
  setRowEntries,
  setCurrentFilters,
  setFilterInfo,
  setFilterActivated,
  setIsLoading,
  setCurrentTimeline,
}) {
  const {
    datastore: { comparisonMode },
  } = useContext(DatastoreContext)

  const labelObj = comparisonModeLabels.find(
    (c) => c.value.toLowerCase() === comparisonMode.toLowerCase(),
  )

  const chartHeader = comparisonMode.toLowerCase() !== 'default'
    ? labelObj?.single || labelObj?.label || ''
    : !isComposite
      ? 'Sub-measure'
      : 'Measure'

  const handleFilterChange = (filterOptions) => {
    setCurrentFilters(filterOptions);
    handleFilteredDataUpdate(filterOptions, currentTimeline);
  };
  const handleTimelineChange = (timelineUpdate) => {
    setCurrentTimeline(timelineUpdate);
    handleFilteredDataUpdate(currentFilters, timelineUpdate);
  };

  return (
    <div className="chart-container">
      <FilterDrawer
        filterDrawerOpen={filterDrawerOpen}
        toggleFilterDrawer={toggleFilterDrawer}
        currentFilters={currentFilters}
        handleFilterChange={handleFilterChange}
        additionalFilterOptions={additionalFilterOptions}
        setFilterActivated={setFilterActivated}
        setIsLoading={setIsLoading}
        setComposite={setComposite}
        setTableFilter={setTableFilter}
        setRowEntries={setRowEntries}
        handleResetData={handleResetData}
        setFilterInfo={setFilterInfo}
      />
      <ChartHeader
        isComposite={isComposite}
        setComposite={setComposite}
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
            options={lineChartOptions(
              {
                colorMap,
                currentTimeline,
                chartData,
                theme,
                chartHeader,
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
  isLoading: isLoadingProps,
  toggleFilterDrawer: toggleFilterDrawerProps,
  handleFilteredDataUpdate: handleFilteredDataUpdateProps,
  setCurrentFilters: setCurrentFiltersProps,
  currentTimeline: currentTimelineProps,
  currentFilters: currentFiltersProps,
  setCurrentTimeline: setCurrentTimelineProps,
  isComposite: isCompositeProps,
  setComposite: setCompositeProps,
  setTableFilter: setTableFilterProps,
  currentResults: currentResultsProps,
  filterDisabled: filterDisabledProps,
  colorMap: colorMapProps,
  setFilterActivated: setFilterActivatedProps,
  setIsLoading: setIsLoadingProps,
  additionalFilterOptions: additionalFilterOptionsProps,
  setRowEntries: setRowEntriesProps,
  handleResetData: handleResetDataProps,
  setTabValue: setTabValueProps,
  setFilterInfo: setFilterInfoProps,
  chartData: chartDataProps,
};

ChartContainer.defaultProps = {
  activeMeasure: defaultActiveMeasure,
  filterDrawerOpen: false,
  isLoading: true,
  toggleFilterDrawer: false,
  handleFilteredDataUpdate: () => undefined,
  setCurrentFilters: () => undefined,
  currentTimeline: [],
  currentFilters: [],
  setCurrentTimeline: () => undefined,
  isComposite: true,
  setComposite: () => undefined,
  setTableFilter: () => undefined,
  currentResults: [],
  filterDisabled: true,
  colorMap: [],
  setFilterActivated: () => undefined,
  setIsLoading: () => undefined,
  additionalFilterOptions: {},
  setRowEntries: () => undefined,
  handleResetData: () => undefined,
  setFilterInfo: () => undefined,
  setTabValue: () => undefined,
  chartData: [],
};

export default ChartContainer;
