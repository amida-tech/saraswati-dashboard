/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { DatastoreContext } from '../../context/DatastoreProvider';
import ComparisonSelector from '../Chart/ComparisonSelector';
import theme from '../../assets/styles/AppTheme';
import MeasurementYearSelector from '../Chart/MeasurementYearSelector';

function Banner({
  headerText, lastUpdated, handleResetData, activeMeasure, setIsLoading,
}) {
  const { pathname } = useLocation();
  const {
    datastore,
    datastoreActions,
  } = useContext(DatastoreContext);

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
            />
          </Box>
        )}

        {!showComparison && (
          <Box className="banner__year-selector">
            <MeasurementYearSelector />
          </Box>
        )}
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
};

Banner.defaultProps = {
  headerText: '',
  lastUpdated: '',
};

export default Banner;
