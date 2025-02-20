import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import PropTypes from 'prop-types';

function MeasureSelector({
  currentResults, measure, handleMeasureChange,
}) {
  return (
    <FormControl className="measure-selector">
      <InputLabel className="measure-selector__label">Select Measure</InputLabel>
      <Select
        className="measure-selector__select"
        value={measure}
        label="Select Measure"
        name="Select Measure"
        onChange={handleMeasureChange}
        data-testid= "select-measure"
        sx={{ color: 'black.light' }}
      >
        {currentResults.map((result) => (
          <MenuItem
            sx={{ color: 'black.light' }}
            key={`by-line-menu-item-selector-${result.measure}`}
            value={result.measure}
            name="Select Measure"
            data-testid={`option-${result.measure}`}
          >
            {result.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

MeasureSelector.propTypes = {
  currentResults: PropTypes.arrayOf(
    PropTypes.shape({
      measure: PropTypes.string,
    }),
  ),
  measure: PropTypes.string,
  handleMeasureChange: PropTypes.func,
};

MeasureSelector.defaultProps = {
  currentResults: [],
  measure: '',
  handleMeasureChange: () => undefined,
}

export default MeasureSelector;
