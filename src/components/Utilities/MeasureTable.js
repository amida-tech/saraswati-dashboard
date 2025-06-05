export const measureTip = 'The actual measure. At the moment, these are always HEDIS measures. (Hover over measures and table headers to view description)';
export const subMeasureTip = 'Hover over sub-measures to view description, for more information click sub-measure to go to NCQA to receive further information.';
export const remainingInclusionsTip = 'The population remaining after exclusions are removed.';
export const eligiblePopulationTip = 'The population of members who are eligible for this measure.';
export const numeratorTip = 'The number of members who have satisfied the criteria for this measure.';
export const denominatorTip = 'The population of members who are eligible for this measure. Currently the same as Eligible Population.';
export const availableExclusionsTip = 'The population that can be excluded based on criteria.';

export const pageSize = 10;

export const inclusions = {
  key: 'included',
  header: 'Remaining Inclusions',
  tooltip: remainingInclusionsTip,
  flexBasis: 'standard',
  alignContent: 'center',
};

export const eligiblePopulation = {
  key: 'eligible',
  header: 'Eligible Population',
  tooltip: eligiblePopulationTip,
  flexBasis: 'standard',
  alignContent: 'center',
};

export const numerator = {
  key: 'numerator',
  header: 'Numerator',
  tooltip: numeratorTip,
  flexBasis: 'standard',
  alignContent: 'center',
};

export const denominator = {
  key: 'denominator',
  header: 'Denominator',
  tooltip: denominatorTip,
  flexBasis: 'standard',
  alignContent: 'center',
};

export const exclusions = {
  key: 'exclusions',
  header: 'Available Exclusions',
  tooltip: availableExclusionsTip,
  flexBasis: 'standard',
  alignContent: 'center',
};

export const headerData = (isComposite, comparisonMode = 'default') => {
  if (comparisonMode !== 'default') {
    return comparisonHeaderInfo;
  } else if (isComposite) {
    return headerInfo;
  }
  return subHeaderInfo;
};

const comparisonHeaderInfo = [
  {
    key: 'label',
    link: true,
    header: 'Comparison Item',
    tooltip: 'The value that is constant for all data points in this group',
    flexBasis: 'large',
  },
  inclusions,
  eligiblePopulation,
  numerator,
  denominator,
  exclusions,
]

export const headerInfo = [
  {
    key: 'label',
    link: true,
    header: 'Measure',
    tooltip: measureTip,
    flexBasis: 'large',
  },
  inclusions,
  eligiblePopulation,
  numerator,
  denominator,
  exclusions,
];

export const subHeaderInfo = [
  {
    key: 'label',
    header: 'Sub-Measure',
    tooltip: subMeasureTip,
    flexBasis: 'large',
  },
  inclusions,
  eligiblePopulation,
  numerator,
  denominator,
  exclusions,
];

export const formatData = (currentResults) => {
  const formattedData = [];
  currentResults.forEach((measureResult) => {
    formattedData.push({
      id: measureResult.label,
      value: measureResult.measure,
      label: measureResult.label,
      type: 'measure',
      included: measureResult.initialPopulation - measureResult.exclusions,
      eligible: measureResult.initialPopulation,
      numerator: measureResult.numerator,
      denominator: measureResult.denominator,
      exclusions: measureResult.exclusions,
    });
  });
  return formattedData;
};
