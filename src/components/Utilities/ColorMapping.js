import tinycolor from 'tinycolor2';

const colorMapping = (allResults, displayData, isComparisonMode = false) => {
  const chartColorArray = [
    '#88CCEE',
    '#CC6677',
    '#117733',
    '#332288',
    '#AA4499',
    '#44AA99',
    '#555555',
    '#661100',
    '#999933',
    '#6699CC',
  ];

  const baseColors = [];
  const byMeasureColorMap = [];

  const colorBySeed = ((seed, idx) => chartColorArray[idx % 10]);

  const distortColor = (color, idx) => {
    let newColor = '';
    if (idx <= 3) {
      newColor = tinycolor(color).brighten(idx * 15).toString();
    } else if (idx <= 6) {
      newColor = tinycolor(color).darken((idx % 3) * 5).toString();
    } else if (idx <= 9) {
      newColor = tinycolor(color).brighten((idx % 3) * 15).toString();
    } else if (idx <= 12) {
      newColor = tinycolor(color).darken((idx % 3) * 15)
        .saturate((idx % 3) * 10)
        .toString();
    } else if (idx <= 15) {
      newColor = tinycolor(color).lighten((idx % 3) * 15).toString();
    } else {
      newColor = color;
    }
    return newColor;
  };

  const categtoryName = isComparisonMode ? 'comparisonItem' : 'measure';

  // CREATES COLOR MAP FOR ALL CURRENT MEASURES
  allResults.forEach((category, idx) => {
    baseColors.push({
      value: category[categtoryName],
      color: colorBySeed(category.measure, idx),
    });
  });

  // HANDLES COMPOSITE VIEW
  if (!displayData || displayData.length === 0 || isComparisonMode) {
    return baseColors;
  }
  // HANDLES MEASURE VIEW
  const baseMeasure = displayData[0][categtoryName];
  const baseMeasureColor = baseColors.find((mapping) => mapping.value === baseMeasure).color;
  byMeasureColorMap.push({
    value: baseMeasure,
    color: baseMeasureColor,
  });
  displayData.slice(0, 1);

  // ADD SUBMEASURES WITH MODIFIED COLOURS
  displayData.forEach((category, idx) => {
    byMeasureColorMap.push({
      value: category[categtoryName],
      color: distortColor(baseMeasureColor, idx),
    });
  });

  return byMeasureColorMap;
};

export default colorMapping;
