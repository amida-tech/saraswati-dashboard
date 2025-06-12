import PropTypes from 'prop-types';
import {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Skeleton,
} from '@mui/material';
import ReportTable from '../components/Utilities/ReportTable';
import { DatastoreContext } from '../context/DatastoreProvider';
import env from '../env';
import MemberReportDisplay from '../components/MemberReport/MemberReportDisplay';

const memberInfoQueryUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}members/info/`);

function MemberReport({ id, memberInfoFetch }) {
  const { datastore } = useContext(DatastoreContext);
  const [memberInfo, setMemberInfo] = useState();
  const [exportUrl, setExportUrl] = useState('');
  const [rowData, setRowData] = useState([]);
  const [description, setDescription] = useState({});
  const [coverage, setCoverage] = useState({});
  const [coverageStatus, setCoverageStatus] = useState('');

  useEffect(() => {
    if (Object.keys(datastore.info).length > 0 && memberInfo) {
      // DESCRIPTIONS ARE PULLED FROM DATASTORE INFO
      const descriptions = datastore?.info[memberInfo.measurementType].description;
      if (Array.isArray(descriptions)) {
        setDescription(descriptions);
      } else {
        setDescription(['No current description for this measure']);
      }
      const formattedMemberData = ReportTable.formatData(
        memberInfo,
        memberInfo.measurementType,
        datastore.info,
      );
      setRowData(formattedMemberData);
    }
  }, [datastore, memberInfo]);

  useEffect(() => {
    async function fetchData() {
      const result = await memberInfoFetch(memberInfoQueryUrl, id);
      setMemberInfo(result);
      setCoverage(result?.coverage);
      setCoverageStatus(result?.coverage[0].status.value);
      setExportUrl(`${env.REACT_APP_HEDIS_MEASURE_API_URL}exports/member/?memberId=${result?.memberId}`);
    }
    fetchData();
  }, [id, memberInfoFetch]);

  return (
    !isLoading
      ? (
        <MemberReportDisplay
          id={id}
          memberInfo={memberInfo}
          datastoreInfo={datastore.info}
          exportUrl={exportUrl}
          coverage={coverage}
          coverageStatus={coverageStatus}
          rowData={rowData}
          description={description}
        />
      )
      : <Skeleton data-testid="loading" variant="rectangular" height="calc(100vh - 12rem - 14px)" animation="wave" />
  // MUI anticipates loading skeletons alongside components,
  // so this seems to be the MUI-inelegant loading solution but wtvr
  );
}

MemberReport.propTypes = {
  id: PropTypes.string,
  memberInfoFetch: PropTypes.func,
};

MemberReport.defaultProps = {
  id: '',
  memberInfoFetch: () => undefined,
};

export default MemberReport;
