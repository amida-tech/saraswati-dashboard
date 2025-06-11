import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import MeasurementYearSelector from '../Chart/MeasurementYearSelector';
import ComparisonSelector from '../Chart/ComparisonSelector';
import theme from '../../assets/styles/AppTheme';

function Banner({
  headerText,
  lastUpdated,
  handleResetData,
  activeMeasure,
  setIsLoading,
  filterActivated,
}) {
  const { pathname } = useLocation();
  const isMeasure = !pathname.endsWith('/reports') && !pathname.includes('/member/');

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

        {isMeasure && (
          <Box className="banner__comparison-selector">
            <ComparisonSelector
              activeMeasure={activeMeasure}
              handleResetData={handleResetData}
              setIsLoading={setIsLoading}
              filterActivated={filterActivated}
            />
          </Box>
        )}
        <Box className="banner__year-selector">
          <MeasurementYearSelector setIsLoading={setIsLoading} />
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
  filterActivated: PropTypes.bool,
};

Banner.defaultProps = {
  headerText: '',
  lastUpdated: '',
  handleResetData: () => { },
  activeMeasure: { measure: '' },
  setIsLoading: () => { },
  filterActivated: false,
};

export default Banner;
