import { useContext, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import Banner from '../components/Common/Banner';
import ReportBuilder from '../components/Reports/ReportBuilder';
import SavedQueries from '../components/Reports/SavedQueries';
import { DatastoreContext } from '../context/DatastoreProvider';
import env from '../env';

export default function Reports() {
  const { datastore, datastoreActions } = useContext(DatastoreContext);

  useEffect(() => {
    datastoreActions.setComparisonMode('default');
  }, [])

  return (
    <Box className="reports">
      <Banner headerText="HEDIS Reports" />
      <Grid className="reports__display">
        {env.REACT_APP_MVP_SETTING === 'false' && <SavedQueries />}
        <ReportBuilder store={datastore} />
      </Grid>
    </Box>
  );
}
