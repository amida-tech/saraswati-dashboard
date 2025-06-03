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
import { comparisonModeLabels } from './ComparisonSelector';

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
  selectedMeasures,
}) {
  const {
    datastore: { comparisonMode, comparisonResults },
  } = useContext(DatastoreContext);

  const handleFilterChange = (options) => {
    setCurrentFilters(options);
    handleFilteredDataUpdate(options, currentTimeline);
  };
  const handleTimelineChange = (timelineUpdate) => {
    setCurrentTimeline(timelineUpdate);
    handleFilteredDataUpdate(currentFilters, timelineUpdate);
  };

  let chartSeries; let chartOptions; let chartCategories; let chartItemHeader;

  const isComparison = comparisonMode
    && comparisonMode !== 'default'
    && Array.isArray(comparisonResults)
    && comparisonResults.length > 0;

  if (isComparison) {
    chartItemHeader = comparisonModeLabels
      .find((c) => c.value === comparisonMode && c.label).single
      || 'Comparison item';
    // --- COMPARISON MODE ---
    const selectedComparisonItems = [
      ...new Set(comparisonResults.map((entry) => entry.comparisonItem)),
    ];
    const allSeries = selectedComparisonItems
      .map((value) => comparisonResults.find((item) => item.comparisonItem === value))
      .filter(Boolean);

    chartSeries = displayDataFormatter(
      allSeries,
      selectedComparisonItems,
      comparisonResults,
      colorMap,
      theme,
      chartItemHeader,
    );
    chartCategories = [
      ...new Set(comparisonResults.map((entry) => entry.date)),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  } else if (!isComposite) {
    chartItemHeader = 'Sub-measure';
    // --- SUBMEASURE MODE: use precomputed chartData from Dashboard ---
    chartSeries = chartData;
    if (chartData[0]?.dates?.length) {
      chartCategories = chartData[0].dates;
    } else if (Array.isArray(chartData[0]?.data)) {
      chartCategories = chartData[0].data.map((_, i) => i);
    } else {
      chartCategories = [];
    }
  } else {
    chartItemHeader = 'Measure';
    // MEASURE MODE: use filtered or default chartData
    chartSeries = chartData;
    chartCategories = chartData[0]?.dates?.length
      ? chartData[0].dates
      : chartData[0]?.data?.map((_, i) => i) || [];
  }

  // filter out anything not selected in selected measures
  if (!isComparison) {
    chartSeries = chartSeries.filter((s) => selectedMeasures.includes(s.name));
    if (chartSeries[0]?.dates?.length) {
      chartCategories = chartSeries[0].dates;
    } else if (Array.isArray(chartSeries[0]?.data)) {
      chartCategories = chartSeries[0].data.map((_, i) => i);
    } else {
      chartCategories = [];
    }
  }

  // eslint-disable-next-line prefer-const
  chartOptions = lineChartOptions({
    colorMap,
    currentTimeline,
    chartData: chartSeries,
    theme,
    categories: chartCategories,
    chartItemHeader,
  });

  return (
    <div className="chart-container">
      {comparisonMode === 'default' && (
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
  currentTimeline: undefined,
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
