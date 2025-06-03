import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import ComparisonSelector from '../Chart/ComparisonSelector';
import theme from '../../assets/styles/AppTheme';
import MeasurementYearSelector from '../Chart/MeasurementYearSelector';

function Banner({
  headerText, lastUpdated, handleResetData, activeMeasure,
  setIsLoading, isComposite, setDisplayData, setSelectedMeasures,
  setCurrentResults,
}) {
  const { pathname } = useLocation();

  const isRoot = pathname === '/';
  const isMeasure = /^\/[^/]+$/.test(pathname);
  const showComparison = !isRoot || isMeasure;

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

        {showComparison && (
          <Box className="banner__comparison-selector">
            <ComparisonSelector
              activeMeasure={activeMeasure}
              handleResetData={handleResetData}
              setIsLoading={setIsLoading}
              isComposite={isComposite}
              setDisplayData={setDisplayData}
              setSelectedMeasures={setSelectedMeasures}
              setCurrentResults={setCurrentResults}
            />
          </Box>
        )}

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
  isComposite: PropTypes.bool,
  setDisplayData: PropTypes.func,
  setSelectedMeasures: PropTypes.func,
  setCurrentResults: PropTypes.func,
};

Banner.defaultProps = {
  headerText: '',
  lastUpdated: '',
  handleResetData: () => {},
  activeMeasure: '',
  setIsLoading: false,
  isComposite: false,
  setDisplayData: {},
  setSelectedMeasures: () => {},
  setCurrentResults: () => {},
};

export default Banner;
