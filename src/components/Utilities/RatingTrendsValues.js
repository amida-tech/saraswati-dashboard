import PropTypes from 'prop-types';
import {
  Typography,
} from '@mui/material';
import {
  starTitle,
  compositePercentTitle,
  measurePercentTitle,
  submeasurePercentTitle,
  percentDisplayValue,
  starDisplayValue,
  submeasurePercentDisplayValue,
  percentageFooter,
  starFooter,
} from './RatingTrendValuesUtil';
import {
  activeMeasureProps, currentResultsProps, trendsProps, widgetPrefsProps, measureCheckerProps,
} from './PropTypes';

export const ratingTrendsTip = 'Rating and Trends displays the current projected star rating as well as highlighting large changes in tracked measures.';
export const starsTip = 'Star rating subject to change depending on measures and other resources. For more information, please contact NCQA.';

export function Title({
  activeMeasure, preferences, currentResults, order,
}) {
  if (preferences?.type === 'star') {
    return starTitle(preferences);
  }
  if (activeMeasure.measure === 'composite' && preferences?.type === 'percentage') {
    return compositePercentTitle(preferences);
  }
  if (activeMeasure.measure === preferences.measure && preferences?.type === 'percentage') {
    return measurePercentTitle(preferences, order);
  }
  // sub-measure percentages submeasures
  if (activeMeasure.measure !== preferences.measure && preferences?.type === 'percentage') {
    return submeasurePercentTitle(activeMeasure, preferences, currentResults, order);
  }

  return (
    <Typography
      variant="h6"
      sx={{
        padding: '1rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        height: 'fit-content',
      }}
    >
      Undefined trend
    </Typography>
  );
}

export function measureChecker(activeMeasure, preferences) {
  const measureCheck = {};

  measureCheck.percentCheck = preferences.type === 'percentage';

  measureCheck.starCheck = preferences.type === 'star';

  measureCheck.submeasureCheck = activeMeasure.measure !== 'composite'
    && activeMeasure.measure !== preferences.measure;

  return measureCheck;
}

export function DisplayValue({
  activeMeasure, preferences, currentResults, trends, measureCheck,
}) {
  const { percentCheck, starCheck, submeasureCheck } = measureCheck;

  if (percentCheck) {
    return percentDisplayValue(trends, preferences, activeMeasure, measureCheck);
  } else if (starCheck) {
    return starDisplayValue(currentResults, preferences);
  } else if (submeasureCheck) {
    return submeasurePercentDisplayValue(trends, activeMeasure, preferences);
  }
  return (
    <Typography>
      Undefined value
    </Typography>
  );
}

export function Footer({ preferences }) {
  if (preferences.type === 'percentage') {
    return percentageFooter(preferences);
  } else if (preferences.type === 'star') {
    return starFooter(preferences);
  }
  return '';
}

// we need to return star, percentage, high, low
export const submeasureResults = (activeMeasure, trends = []) => {
  const trendObj = Array.isArray(trends)
    ? trends.find((t) => t.measure === activeMeasure.measure) || {}
    : {};
  const subScoreTrends = Array.isArray(trendObj.subScoreTrends)
    ? trendObj.subScoreTrends
    : [];

  const values = {
    0: { type: 'star', measure: activeMeasure.measure },
    1: { type: 'percentage', measure: activeMeasure.measure },
  };

  const manySubscores = subScoreTrends.length > 1;

  if (manySubscores) {
    const sorted = [...subScoreTrends].sort(
      (a, b) => a.percentChange - b.percentChange,
    );
    const highLows = [sorted.at(-1), sorted[0]];
    highLows.forEach((trend, idx) => {
      values[idx + 2] = {
        type: 'percentage',
        measure: trend.measure,
      };
    });
  }

  return values;
};

measureChecker.propTypes = measureCheckerProps;

Title.propTypes = {
  activeMeasure: activeMeasureProps,
  trends: PropTypes.shape({
    measure: PropTypes.string,
    precentChange: PropTypes.number,
    subScoretrend: PropTypes.arrayOf(PropTypes.shape({
      measure: PropTypes.string,
      percentChange: PropTypes.number,
    })),
  }),
  preferences: widgetPrefsProps,
  currentResults: PropTypes.arrayOf(PropTypes.shape({})),
  order: PropTypes.number,
};
DisplayValue.propTypes = {
  activeMeasure: activeMeasureProps,
  currentResults: currentResultsProps,
  trends: trendsProps,
  preferences: widgetPrefsProps,
  measureCheck: measureCheckerProps,
};
Footer.propTypes = {
  preferences: widgetPrefsProps,
};

Title.defaultProps = {
  activeMeasure: {},
  trends: {},
  preferences: {},
  currentResults: {},
  order: 0,
};
DisplayValue.defaultProps = {
  activeMeasure: {},
  currentResults: {},
  trends: {},
  preferences: {},
  measureCheck: {},
};
Footer.defaultProps = {
  preferences: {},
};
measureChecker.defaultProps = {
  percentCheck: false,
  starCheck: false,
  submeasureCheck: false,
};
