/* eslint-disable react/jsx-props-no-spreading */
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Badge, Box, Button, FormControlLabel, Grid, Menu, Radio, RadioGroup, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import theme from '../../assets/styles/AppTheme';
import { TimelineOptions } from '../Utilities/ChartUtils';

const timelineLabel = (choice) => {
  switch (choice) {
    case 'all':
      return 'All';
    case 'custom':
      return 'Custom';
    case 'ytd':
      return 'YTD';
    default:
      return `${choice} Days`;
  }
};

function ChartBar({
  filterDrawerOpen,
  toggleFilterDrawer,
  filterSum,
  currentTimeline,
  handleTimelineChange,
  filterDisabled,
}) {
  const buttonStyling = {};

  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);

  const handleDateOpen = (event) => {
    setDateOpen(true);
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setDateOpen(false);
    setDateAnchorEl(null);
  };

  const handleDateChange = (event) => {
    handleTimelineChange({
      choice: event.target.value,
      range: [null, null],
    });
    handleDateClose();
  };

  const onClickFilter = () => {
    toggleFilterDrawer(!filterDrawerOpen);
  };

  const timelineCaption = `Timeline: ${timelineLabel(currentTimeline.choice)}`;

  return (
    <Box className="chart-container__chart-bar">
      <Grid container direction="row" justifyContent="flex-end" spacing={0.1}>
        <Grid item sx={buttonStyling} className="chart-container__chart-bar--timeline">
          <Button
            key="d3-YTD"
            color="secondary"
            onClick={handleDateOpen}
            variant="text"
            startIcon={<DateRangeIcon />}
          >
            <Typography variant="caption">
              {timelineCaption}
            </Typography>
          </Button>
          <Menu
            id="date-menu"
            anchorEl={dateAnchorEl}
            open={dateOpen}
            onClose={handleDateClose}
            onClick={null}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <RadioGroup
              sx={{ padding: '0 1rem' }}
              value={currentTimeline.choice}
            >
              {TimelineOptions.map((option) => (
                <FormControlLabel
                  key={`chart-bar-timeline-${option.value}`}
                  color={theme.palette?.bluegray.D4}
                  className="chart-container__chart-bar__radio-label"
                  value={option.value}
                  control={<Radio onClick={handleDateChange} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </Menu>
        </Grid>

        <Grid item sx={buttonStyling} className="chart-container__chart-bar--filter">
          <Badge badgeContent={filterSum} className={`chart-container__chart-bar__badge${filterDisabled ? '--hidden' : ''}`}>
            <Button
              className="chart-container__chart-bar__filter-button"
              sx={{ width: '7 rem', justifyContent: 'left' }}
              color="secondary"
              variant="text"
              onClick={onClickFilter}
              disabled={filterDisabled}
              startIcon={(
                <FilterAltIcon />
              )}
            >
              <Typography variant="caption">
                Filter
              </Typography>
            </Button>
          </Badge>
        </Grid>
      </Grid>
    </Box>
  );
}

ChartBar.propTypes = {
  filterDrawerOpen: PropTypes.bool,
  toggleFilterDrawer: PropTypes.func,
  filterSum: PropTypes.number,
  // Necessary for DateRangePicker to function and pass props
  currentTimeline: PropTypes.shape({
    choice: PropTypes.string,
    range: PropTypes.arrayOf(PropTypes.number),
  }),
  handleTimelineChange: PropTypes.func,
  filterDisabled: PropTypes.bool,
};

ChartBar.defaultProps = {
  filterDrawerOpen: false,
  toggleFilterDrawer: undefined,
  filterSum: 0,
  currentTimeline: {
    choice: 'all',
    range: [null, null],
  },
  handleTimelineChange: undefined,
  filterDisabled: false,
};

export default ChartBar;
