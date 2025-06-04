import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { DatastoreContext } from '../../context/DatastoreProvider';
import theme from '../../assets/styles/AppTheme';
import { comparisonModeLabels } from './ComparisonSelector';

function ChartHeader({
  isComposite,
  isLoading,
  handleResetData,
  labelGenerator,
  currentResults,
  activeMeasure,
}) {
  const {
    datastore: { comparisonMode },
  } = useContext(DatastoreContext);

  const comparisonLabel = comparisonModeLabels
    .find((c) => c.value === comparisonMode && c.label).label
    || 'Comparison Mode';

  const chartTitle = comparisonMode === 'default'
    ? 'All Measures'
    : `Compare By ${comparisonLabel} For ${activeMeasure.measure}`;

  const titleDisplay = (
    <Grid className="chart-container__return-title-display">
      <Typography
        color={theme.palette.bluegray.D2}
        className="chart-container__title"
      >
        {chartTitle}
      </Typography>
    </Grid>
  );

  const linkDisplay = (
    <Grid
      className="chart-container__return-link-display"
      onClick={() => handleResetData('all')}
    >
      <Typography className="chart-container__title">
        <ArrowBackIosIcon className="chart-container__return-icon" />
        Return to Composite View
      </Typography>
      {!isLoading && (
        <Grid className="chart-container__return-measure-display">
          {labelGenerator(
            currentResults.find(
              (r) => r.measure === activeMeasure.measure,
            ),
          )}
        </Grid>
      )}
    </Grid>
  );

  return isComposite || comparisonMode !== 'default' ? titleDisplay : linkDisplay;
}

ChartHeader.propTypes = {
  isComposite: PropTypes.bool,
  handleResetData: PropTypes.func,
  isLoading: PropTypes.bool,
  labelGenerator: PropTypes.func,
  currentResults: PropTypes.arrayOf(PropTypes.shape({})),
  activeMeasure: PropTypes.shape({
    measure: PropTypes.string,
    denominator: PropTypes.number,
    shortLabel: PropTypes.string,
    starRating: PropTypes.number,
    title: PropTypes.string,
  }),
};

ChartHeader.defaultProps = {
  isComposite: true,
  isLoading: true,
  handleResetData: () => { },
  labelGenerator: () => undefined,
  currentResults: [],
  activeMeasure: {
    measure: '',
    denominator: 0,
    shortLabel: '',
    starRating: 0,
    title: '',
  },
};

export default ChartHeader;
