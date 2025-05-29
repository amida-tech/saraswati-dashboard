/* eslint-disable no-nested-ternary */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material';
import { createContext, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';

import { DatastoreContext } from '../../context/DatastoreProvider';
import theme from '../../assets/styles/AppTheme';

import FilterDrawer from '../FilterMenu/FilterDrawer';
import ChartBar from './ChartBar';
import ChartHeader from './ChartHeader';
import { lineChartOptions, displayDataFormatter } from '../Utilities/ChartUtils';

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
  setIsCompositeProps,
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

export const firstRenderContext = createContext(true);

function labelGenerator(measure) {
  if (!measure?.label) return '';
  const { label } = measure;
  return (
    <Grid sx={{ color: theme.palette?.bluegray.D4 }} className="chart-container__return-measure-labels">
      <Typography className="chart-container__return-measure-title">{label.substring(0, label.indexOf(' '))}</Typography>
      <Typography className="chart-container__return-measure-description">{label.substring(label.indexOf('- ') + 1)}</Typography>
    </Grid>
  );
}

function ChartContainer({
  setCurrentFilters,
  currentTimeline,
  currentFilters,
  handleFilteredDataUpdate,
  setCurrentTimeline,
  filterDrawerOpen,
  toggleFilterDrawer,
  isComposite,
  setIsComposite,
  setTableFilter,
  isLoading,
  currentResults,
  activeMeasure,
  filterDisabled,
  colorMap,
  setFilterActivated,
  setIsLoading,
  additionalFilterOptions,
  setTabValue,
  setRowEntries,
  handleResetData,
  setFilterInfo,
  chartData,
}) {
  const {
    datastore: { comparisonMode, comparisonResults, filterOptions },
  } = useContext(DatastoreContext);

  const handleFilterChange = (options) => {
    setCurrentFilters(options);
    handleFilteredDataUpdate(options, currentTimeline);
  };
  const handleTimelineChange = (timelineUpdate) => {
    setCurrentTimeline(timelineUpdate);
    handleFilteredDataUpdate(currentFilters, timelineUpdate);
  };

  // CHART DATA PREPARATION
  let chartSeries;
  let chartCategories;
  let chartOptions;

  const isComparison = comparisonMode
    && comparisonMode !== 'Default'
    && Array.isArray(comparisonResults)
    && comparisonResults.length > 0;

  if (isComparison) {
    // --- COMPARISON MODE ---
    // e.g. payors, healthcareProviders, etc
    const filterKey = Object.keys(filterOptions)
      .find((k) => comparisonMode.toLowerCase().includes(k.toLowerCase()));
    const comparisonItems = filterOptions?.[filterKey] || [];
    const selectedComparisonItems = comparisonItems.map((item) => item.value);

    // Prepare all series keys (values) from the filterOptions in this comparison mode
    const allSeries = selectedComparisonItems.map((value) => comparisonResults
      .find((item) => (item.comparisonItem === value))).filter(Boolean);

    chartSeries = displayDataFormatter(
      allSeries,
      selectedComparisonItems,
      comparisonResults,
      colorMap,
      theme,
      comparisonMode,
      filterOptions,
    );
    chartCategories = [
      ...new Set(comparisonResults.map((entry) => entry.date)),
    ].sort();
    chartOptions = lineChartOptions({
      colorMap,
      currentTimeline,
      chartData: chartSeries,
      theme,
      categories: chartCategories,
    });
  } else {
    // --- DEFAULT (SINGLE MEASURE) MODE ---
    chartSeries = chartData;
    // Try to extract categories from chartData
    if (chartSeries.length && Array.isArray(chartSeries[0].data)) {
      chartCategories = chartSeries[0].dates || [];
      // If not present, fallback to indices
      if (!chartCategories.length) {
        chartCategories = chartSeries[0].data.map((_, idx) => idx);
      }
    } else {
      chartCategories = [];
    }
    chartOptions = lineChartOptions({
      colorMap,
      currentTimeline,
      chartData: chartSeries,
      theme,
      categories: chartCategories,
    });
  }

  return (
    <div className="chart-container">
      {comparisonMode !== 'Default' && (
        <FilterDrawer
          filterDrawerOpen={filterDrawerOpen}
          toggleFilterDrawer={toggleFilterDrawer}
          currentFilters={currentFilters}
          handleFilterChange={handleFilterChange}
          additionalFilterOptions={additionalFilterOptions}
          setFilterActivated={setFilterActivated}
          setIsLoading={setIsLoading}
          setIsComposite={setIsComposite}
          setTableFilter={setTableFilter}
          setRowEntries={setRowEntries}
          handleResetData={handleResetData}
          setFilterInfo={setFilterInfo}
        />
      )}
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
            options={chartOptions}
            series={chartSeries}
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
  setIsComposite: setIsCompositeProps,
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
  setIsComposite: () => undefined,
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
