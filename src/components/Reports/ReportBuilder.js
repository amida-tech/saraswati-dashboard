import { useEffect, useState } from 'react';
import {
  Box, Button, Grid, Typography,
} from '@mui/material';
import theme from '../../assets/styles/AppTheme';
import { storeProps } from '../Utilities/PropTypes';
import MeasureSelector from '../Common/MeasureSelector';
import env from '../../env';

function ReportBuilder({ store }) {
  const [measure, setMeasure] = useState('');

  useEffect(() => {
    if (store.currentResults !== undefined) {
      setMeasure(store.currentResults[0]?.measure);
    }
  }, [store]);

  const handleMeasureChange = (e) => {
    setMeasure(e.target.value);
  };

  return (
    <Box sx={{ color: theme.palette?.bluegray.D1 }} className="report-builder">
      <Typography variant="h2" className="report-builder__h2-header">Build A Report</Typography>
      <Typography className="report-builder__text">
        Generate a comprehensive report of specific HEDIS measure data.
        {' '}
        Start by selecting the measure, then click on
        {' '}
        <strong>Get Report</strong>
        {' '}
        to receive a data sheet export.
      </Typography>
      <Grid item className="report-builder__selector-panel">
        <MeasureSelector
          currentResults={store.currentResults}
          measure={measure}
          handleMeasureChange={handleMeasureChange}
        />
      </Grid>
      { measure !== undefined
        && (
        <Button
          color="primary"
          variant="contained"
          className="report-builder__download-link"
          href={`${env.REACT_APP_HEDIS_MEASURE_API_URL}measures/exportCsv?measurementType=${measure}`}
          target="_blank"
          rel="noreferrer"
        >
          Get Report
        </Button>
        )}
    </Box>

  );
}
ReportBuilder.propTypes = {
  store: storeProps,
};
ReportBuilder.defaultProps = {
  store: {
    currentResults: [],
  },
};

export default ReportBuilder;
