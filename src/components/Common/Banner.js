import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import MeasurementYearSelector from '../Chart/MeasurmentYearSelector';
import ComparisonSelector from '../Chart/ComparisonSelector';
import theme from '../../assets/styles/AppTheme';

function Banner({
  headerText, lastUpdated, handleResetData, activeMeasure, setIsLoading,
}) {
  return (
    <Box className="banner">
      <Box className="banner__header-container">
        <Typography
          variant="h1"
          color={theme.palette?.bluegray.D2}
          className="banner__header"
        >
          {headerText}
        </Typography>

        <Box className="banner__comparison-selector">
          <ComparisonSelector
            activeMeasure={activeMeasure}
            handleResetData={handleResetData}
            setIsLoading={setIsLoading}
          />
        </Box>

        <Box className="banner__year-selector">
          <MeasurementYearSelector />
        </Box>
      </Box>

      {lastUpdated && (
        <Box className="banner__update-box">
          <Typography
            color={theme.palette?.bluegray.D1}
            className="banner__update-label"
          >
            Last Updated:
          </Typography>
          <Typography
            color={theme.palette?.bluegray.L1}
            className="banner__update-time"
          >
            {' '}
            {lastUpdated}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

Banner.propTypes = {
  headerText: PropTypes.string,
  lastUpdated: PropTypes.string,
  handleResetData: PropTypes.func,
  activeMeasure: PropTypes.shape({
    measure: PropTypes.string,
  }),
  setIsLoading: PropTypes.func,
};

Banner.defaultProps = {
  headerText: '',
  lastUpdated: '',
  handleResetData: () => { },
  activeMeasure: '',
  setIsLoading: false,
};

export default Banner;
