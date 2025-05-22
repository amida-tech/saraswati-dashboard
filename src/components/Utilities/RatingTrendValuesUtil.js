import HelpIcon from '@mui/icons-material/Help';
import ToolTip from '@mui/material/Tooltip'; import {
  Typography, Rating,
} from '@mui/material';
import { ratingTrendsTitle } from '../../assets/styles/RatingTrends.style';
import theme from '../../assets/styles/AppTheme';

export const ratingTrendsTip = 'Rating and Trends displays the current projected star rating as well as highlighting large changes in tracked measures.';
export const starsTip = 'Star rating subject to change depending on measures and other resources. For more information, please contact NCQA.'
export const measurePercentTip = 'Trend information representing the changes of a tracked measure over a designated over the period of time.'
export const submeasureHiTip = 'Trend data demonstrating the greatest positive change of a sub-measure over a designated over the period of time.'
export const submeasureLoTip = 'Trend data demonstrating the greatest negative change of a sub-measure over a designated over the period of time.'
export const submeasureTips = [
  starsTip,
  measurePercentTip,
  submeasureLoTip,
  submeasureHiTip,
]

export function starTitle(preferences) {
  return (
    <Typography
      variant="h6"
      sx={{
        padding: '1rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {`${preferences.measure.toUpperCase()} Star Rating`}
      <ToolTip title={starsTip} sx={{ alignSelf: 'center', ml: '.5rem' }}>
        <HelpIcon color="secondary" className="rating-trends__help-icon" fontSize="small" />
      </ToolTip>
    </Typography>
  );
}

export function compositePercentTitle(preferences) {
  return (
    <Typography
      variant="h6"
      sx={{
        padding: '1rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {`${preferences.measure.toUpperCase()} Score % Change`}
      <ToolTip title={ratingTrendsTip} sx={{ alignSelf: 'center', ml: '.5rem' }}>
        <HelpIcon color="secondary" className="rating-trends__help-icon" fontSize="small" />
      </ToolTip>
    </Typography>
  );
}

export function measurePercentTitle(preferences, order) {
  return (
    <Typography
      variant="h6"
      sx={ratingTrendsTitle(preferences.measure)}
    >
      {` ${preferences.measure.toUpperCase()} Score % Change `}
      <ToolTip title={submeasureTips[order]} sx={{ alignSelf: 'center', margin: '.2rem' }}>
        <HelpIcon color="secondary" className="rating-trends__help-icon" fontSize="small" />
      </ToolTip>
    </Typography>
  );
}

export function submeasurePercentTitle(activeMeasure, preferences, currentResults, order) {
  const subMeasures = currentResults.find(
    (trend) => trend.measure === activeMeasure.measure,
  ).subScores;

  let label = subMeasures?.find((sub) => preferences.measure === sub.measure).measure;
  label = `${label.toUpperCase()} Score % Change`;

  return (
    <Typography
      variant="h6"
      sx={ratingTrendsTitle(label)}
    >
      {label}
      <ToolTip title={submeasureTips[order]} sx={{ alignSelf: 'center', ml: '.5rem' }}>
        <HelpIcon color="secondary" className="rating-trends__help-icon" fontSize="small" />
      </ToolTip>
    </Typography>
  );
}

export function percentDisplayValue(trends, preferences, activeMeasure, measureCheck) {
  let percentValue
  if (measureCheck.submeasureCheck) {
    percentValue = trends.find(
      (trend) => trend.measure === activeMeasure.measure.toLowerCase(),
    ).subScoreTrends.find(
      (sub) => sub.measure === preferences.measure,
    ).percentChange
  } else {
    percentValue = trends.find(
      (trend) => trend.measure === preferences.measure.toLowerCase(),
    )?.percentChange || 0;
  }

  let percentColor = theme.palette?.text.disabled;
  if (percentValue > 0) {
    percentColor = theme.palette?.success.main;
  } else if (percentValue < 0) {
    percentColor = theme.palette?.error.main;
  }
  return (
    <div aria-label={preferences.measure}>
      <Typography color={percentColor} variant="h4" sx={{ height: 'fit-content', padding: '0' }}>
        {percentValue < 0 ? percentValue : `+ ${percentValue}`}
        {' '}
        %
      </Typography>
    </div>
  );
}

export function starDisplayValue(currentResults, preferences) {
  const starValue = currentResults.find(
    (trend) => trend.measure === preferences.measure.toLowerCase(),
  )?.starRating || 0;
  return (
    <div aria-label={preferences.measure}>
      <Rating
        value={starValue}
        precision={0.5}
        sx={{ fontSize: 'xxx-large' }}
        getLabelText={((prefs) => prefs.measure)}
        readOnly
      />
    </div>
  );
}

export function submeasurePercentDisplayValue(trends, activeMeasure, preferences) {
  const percentValue = trends.find(
    (trend) => activeMeasure.measure === trend.measure,
  ).subScoreTrends.find(
    (trend) => trend.measure === preferences.measure,
  ).percentChange;
  let percentColor = theme.palette?.text.disabled;
  if (percentValue > 0) {
    percentColor = theme.palette?.success.main;
  } else if (percentValue < 0) {
    percentColor = theme.palette?.error.main;
  }
  return (
    <div aria-label={preferences.measure}>
      <Typography color={percentColor} variant="h4" sx={{ height: 'fit-content', padding: '0' }}>
        {percentValue < 0 ? percentValue : `+${percentValue}`}
        {' '}
        %
      </Typography>
    </div>
  );
}

export function percentageFooter(preferences) {
  return (
    <Typography sx={{ height: 'fit-content' }}>
      {`(${preferences.measure.toUpperCase()} over the past week)`}
    </Typography>
  );
}

export function starFooter(preferences) {
  return (
    <Typography sx={{ height: '3rem', alignItems: 'center' }}>
      {`(${preferences.measure.toUpperCase()} over the past week)`}
    </Typography>
  );
}
