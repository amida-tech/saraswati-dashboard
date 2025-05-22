import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import theme from '../../assets/styles/AppTheme';
import { formatData } from '../Utilities/MeasureTable';
import {
  activeMeasureProps,
  colorMapProps,
  currentResultsProps,
  handleSelectedMeasureChangeProps,
  headerInfoProps,
} from '../Utilities/PropTypes';

export default function OverviewTable({
  activeMeasure, headerInfo, currentResults, colorMap, handleSelectedMeasureChange,
}) {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [checkboxColors, setCheckboxColors] = useState('');
  // eslint-disable-next-line max-len
  const [rowSelectionModel, setRowSelectionModel] = useState(() => currentResults?.map((m) => m.label) ?? []);
  const navigate = useNavigate();

  useEffect(() => {
    const columnData = Object.values(headerInfo)
      .map((info, idx) => ({
        key: info.key,
        field: info.key,
        headerName: info.header,
        description: info.tooltip,
        headerAlign: idx === 0 ? 'left' : 'center',
        align: idx === 0 ? 'left' : 'center',
        width: idx === 0 ? 250 : 200,
      }));
    const rowData = formatData(currentResults);

    const mapping = rowData.map((measure) => colorMap
      .find((map) => (map.value === measure.value))?.color || theme.palette?.primary.main);
    const newColorObj = {};
    const colorMaps = mapping?.reduce((colorObj, mapColor, idx) => {
      const colorClass = `& .MuiDataGrid-virtualScrollerRenderZone > div:nth-of-type(${idx + 1}) > div > span`;
      newColorObj[colorClass] = { color: mapColor };
      return newColorObj;
    }, newColorObj);

    setCheckboxColors(colorMaps);
    setColumns(columnData);
    setRows(rowData);
    setRowSelectionModel(() => rowData.map((r) => r.id));
  }, [currentResults, colorMap, headerInfo]);

  const handleRowSelectionModelChange = (event) => {
    setRowSelectionModel(event);

    const newSelections = event
      .map((label) => currentResults
        .find((measure) => measure.label === label)
        .measure);

    handleSelectedMeasureChange(newSelections);
  };

  const handleRowClick = (event) => {
    if (activeMeasure.measure === 'composite') {
      navigate((`/${event.row.value}`));
    } else {
      // alert action here -- see MTR
    }
  };

  return (
    <Box
      sx={{
        height: 750,
        width: '100%',
        padding: '1rem .5rem',
        fontWeight: 'bold',
        fontSize: 'medium',
        color: theme.palette?.bluegray.D1,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        density="comfortable"
        rowHeight={65}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        showCellRightBorder={false}
        showColumnRightBorder={false}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(event) => handleRowSelectionModelChange(event)}
        onRowClick={(event) => handleRowClick(event)}
        components={{
          Toolbar: GridToolbar,
        }}
        disableColumnMenu
        disableSelectionOnClick
        disableVirtualization
        // filterMode='server'
        pagination="client"
        // sortingMode='server'
        sx={{
          // CHECKBOX ICONS
          ...checkboxColors,
          '& .MuiDataGrid-columnHeaderTitleContainerContent': {
            fontSize: '1rem',
            width: '-webkit-fill-available',
            display: 'flex',
            placeContent: 'center',
          },
          // HEADERS
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette?.background.main,
          },
          '& .MuiDataGrid-columnHeaderTitleContainerContent:nth-of-type(1)': {
            display: 'flex',
            placeContent: 'inherit',
          },
          '& .MuiDataGrid-columnHeaderDraggableContainer': {
            width: '-webkit-fill-available',
          },
          // CHECKBOXES
          '& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox': {
            width: '100px !important',
            maxWidth: 'unset !important',
          },
          // CELL CONTENT
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal !important',
          },
          '& .MuiDataGrid-cellContent': {
            userSelect: 'none',
            transition: '100ms',
          },
          '& .MuiDataGrid-cellContent:hover': {
            color: theme.palette?.primary.main,
            cursor: 'pointer',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'unset',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'unset',
            transition: '100ms',
          },
          '& .MuiDataGrid-cell:focus-within:hover': {
            color: theme.palette?.primary.main,
          },
          // MENU
          '& .MuiDataGrid-menuIconButton': {
            transition: '200ms !important',
            width: '2rem',
            // margin: '-1rem -1rem 1.5rem'
          },
          '& .MuiDataGrid-toolbarContainer': {
            margin: '.2rem 0 .2rem 2rem',
          },
          '& .MuiDataGrid-menuIcon': {
            visibility: 'visible',
            width: '2rem',
            transform: 'rotate(270deg)',
          },
          '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon': {
            width: '2rem',
          },

          // WE DON'T NEED THESE BELOW SO WE HIDE ¯\_(ツ)_/¯
          '& .MuiDataGrid-sortIcon': {
            display: 'none',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-iconButtonContainer': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
}

OverviewTable.propTypes = {
  activeMeasure: activeMeasureProps,
  headerInfo: headerInfoProps,
  currentResults: currentResultsProps,
  colorMap: colorMapProps,
  handleSelectedMeasureChange: handleSelectedMeasureChangeProps,
};

OverviewTable.defaultProps = {
  activeMeasure: {
    measure: '',
    denominator: 0,
    shortlabel: '',
    starRating: '',
    title: '',
  },
  headerInfo: [],
  currentResults: [],
  colorMap: [],
  handleSelectedMeasureChange: () => undefined,
};
