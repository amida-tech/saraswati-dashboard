import { useContext } from 'react';
import {
  Grid, Typography, Box,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import theme from '../../assets/styles/AppTheme';

import { TableTab } from '../Utilities/TableTab';

import { DatastoreContext } from '../../context/DatastoreProvider';

import {
  activeMeasureProps,
  defaultActiveMeasure,
  tabValueProps,
  isCompositeProps,
  handleSelectedMeasureChangeProps,
  headerInfoProps,
  currentResultsProps,
  colorMapProps,
  tableFilterProps,
  handleTableFilterChangeProps,
  rowEntriesProps,
  handleTabChangeProps,
} from '../Utilities/PropTypes';
import TableFilterPanel from './TableFilterPanel';
import MeasureSelector from '../Common/MeasureSelector';
import EntriesFound from './EntriesFound';
import OverviewTable from './OverviewTable';
import MemberTable from './MemberTable';

function DisplayTableContainer({
  activeMeasure,
  tabValue,
  isComposite,
  headerInfo,
  currentResults,
  colorMap,
  tableFilter,
  handleTableFilterChange,
  handleSelectedMeasureChange,
  rowEntries,
  handleTabChange,
}) {
  const { datastore } = useContext(DatastoreContext);

  return (
    <Grid
      sx={{ outline: `${theme.palette?.primary.dark} solid 1px` }}
      className="chart-container__bottom-display"
    >
      <Box className="chart-container__overview-member-chart">
        <TabContext value={tabValue}>
          <Box
            sx={{
              height: '4rem',
              outline: `${theme.palette?.primary.dark} solid 1px`,
              backgroundColor: theme.palette?.primary.main,
            }}
          >
            {isComposite ? (
              <TabList
                TabIndicatorProps={{ style: { backgroundColor: 'transparent', gap: '1rem' } }}
                sx={{ marginLeft: '8rem', height: '4rem', alignItems: 'center' }}
                onChange={handleTabChange}
                aria-label="overview and members tabs"
              >
                <TableTab
                  className="chart-container__table-selection-button"
                  sx={{
                    color: theme.palette?.primary.light,
                  }}
                  label="Overview"
                  value="overview"
                />
              </TabList>
            ) : (
              <TabList TabIndicatorProps={{ style: { backgroundColor: 'transparent', gap: '1rem' } }} sx={{ marginLeft: '8rem', height: '4rem', alignItems: 'center' }} onChange={handleTabChange} aria-label="overview and members tabs">
                <TableTab
                  className="chart-container__table-selection-button"
                  label="Overview"
                  value="overview"
                />
                <TableTab
                  className="chart-container__table-selection-button"
                  label="Members"
                  value="members"
                />
              </TabList>
            )}
          </Box>

          <TabPanel value="overview">

            {headerInfo[0].header !== 'Sub-Measure' && datastore.comparisonMode === 'default'
              ? (
                <Grid className="chart-container__measure-selector">
                  <Typography
                    color={theme.palette?.bluegray.D4}
                    className="chart-container__selector-title"
                  >
                    Detailed View:
                  </Typography>
                  <MeasureSelector
                    measure={activeMeasure.measure}
                    currentResults={datastore.currentResults}
                    handleMeasureChange={handleSelectedMeasureChange}
                  />
                </Grid>
              ) : null}

            <OverviewTable
              activeMeasure={activeMeasure}
              headerInfo={headerInfo}
              currentResults={currentResults}
              colorMap={colorMap}
              handleSelectedMeasureChange={handleSelectedMeasureChange}
            />

          </TabPanel>

          <TabPanel value="members">

            <TableFilterPanel
              tableFilter={tableFilter}
              handleTableFilterChange={handleTableFilterChange}
            />
            <EntriesFound total={rowEntries.length} />

            <MemberTable
              activeMeasure={activeMeasure}
              headerInfo={headerInfo}
              rowEntries={rowEntries}
            />

          </TabPanel>

        </TabContext>
      </Box>
    </Grid>

  );
}

DisplayTableContainer.propTypes = {
  activeMeasure: activeMeasureProps,
  tabValue: tabValueProps,
  isComposite: isCompositeProps,
  handleSelectedMeasureChange: handleSelectedMeasureChangeProps,
  headerInfo: headerInfoProps,
  currentResults: currentResultsProps,
  colorMap: colorMapProps,
  tableFilter: tableFilterProps,
  handleTableFilterChange: handleTableFilterChangeProps,
  rowEntries: rowEntriesProps,
  handleTabChange: handleTabChangeProps,
};

DisplayTableContainer.defaultProps = {
  activeMeasure: defaultActiveMeasure,
  tabValue: 'overview',
  isComposite: true,
  handleSelectedMeasureChange: () => undefined,
  headerInfo: [],
  currentResults: [],
  colorMap: [],
  tableFilter: [],
  handleTableFilterChange: () => undefined,
  rowEntries: [],
  handleTabChange: () => undefined,
};

export default DisplayTableContainer;
