import PropTypes from 'prop-types';

export const storeProps = PropTypes.shape({
  results: PropTypes.arrayOf(
    PropTypes.shape({
      measure: PropTypes.string,
    }),
  ),
  currentResults: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
});
export const filterActivatedProps = PropTypes.bool;
export const setFilterDrawerFailProps = PropTypes.func;
export const activeMeasureProps = PropTypes.shape({
  measure: PropTypes.string,
  denominator: PropTypes.number,
  shortLabel: PropTypes.string,
  starRating: PropTypes.number,
  title: PropTypes.string,
});
export const hardResetProps = PropTypes.bool;
export const setHardResetProps = PropTypes.func;
export const defaultActiveMeasure = {
  measure: '',
  denominator: 0,
  shortLabel: '',
  starRating: 0,
  title: '',
};
export const handleResetProps = PropTypes.func;
export const setFilterInfoProps = PropTypes.func;
export const handleResetDataProps = PropTypes.func;
export const filterDrawerOpenProps = PropTypes.bool;
export const dashboardStateProps = PropTypes.shape({
});
export const chartDataProps = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.number),
  }),
);
export const toggleFilterDrawerProps = PropTypes.func;
export const setActiveMeasureProps = PropTypes.func;

export const colorMappingProps = PropTypes.arrayOf(
  PropTypes.shape({
    value: PropTypes.string,
    color: PropTypes.string,
  }),
);
export const colorMapProps = PropTypes.arrayOf(
  PropTypes.shape({
    value: PropTypes.string,
    color: PropTypes.string,
  }),
);
export const handleFilterChangeProps = PropTypes.func;
export const handleSelectedMeasureChangeProps = PropTypes.func;
export const handleTableFilterChangeProps = PropTypes.func;
export const measureInfoProps = PropTypes.shape({
  PropTypes: PropTypes.shape({
    description: PropTypes.string,
    displayLabel: PropTypes.string,
    domainOfCare: PropTypes.string,
    hasSubMeasures: PropTypes.bool,
    inverted: PropTypes.bool,
    link: PropTypes.string,
    measureType: PropTypes.string,
    title: PropTypes.string,
    weight: PropTypes.number,
  }),
});
export const filterDrawerFailProps = PropTypes.bool;
export const currentFiltersProps = PropTypes.shape({
  domainsOfCare: PropTypes.arrayOf(PropTypes.string),
  percentRange: PropTypes.arrayOf(PropTypes.number),
  stars: PropTypes.arrayOf(PropTypes.number),
  sum: PropTypes.number,
  payors: PropTypes.arrayOf(PropTypes.string),
  healthcareProviders: PropTypes.arrayOf(PropTypes.string),
  healthcareCoverages: PropTypes.arrayOf(PropTypes.string),
  practitioners: PropTypes.arrayOf(PropTypes.string),
});

export const currentTimelineProps = PropTypes.shape({
  choice: PropTypes.string,
  range: PropTypes.arrayOf(PropTypes.number),
});
export const selectedMeasuresProps = PropTypes.arrayOf(PropTypes.string);
export const isLoadingProps = PropTypes.bool;
export const isCompositeProps = PropTypes.bool;
export const filterDisabledProps = PropTypes.bool;
export const dashboardActionsProps = PropTypes.shape({
  toggleFilterDrawer: PropTypes.func,
  setActiveMeasure: PropTypes.func,
});

export const displayDataProps = PropTypes.arrayOf(
  PropTypes.shape({
    date: PropTypes.string,
    denominator: PropTypes.number,
    exclusions: PropTypes.number,
    initialPopulation: PropTypes.number,
    measure: PropTypes.string,
    numerator: PropTypes.number,
    starRating: PropTypes.number,
    value: PropTypes.number,
  }),
);

export const additionalFilterOptionsProps = PropTypes.shape({
  payors: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      payor: PropTypes.string,
      value: PropTypes.string,
      timestamp: PropTypes.string,
    }),
  ),
  healthcareProviders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      provider: PropTypes.string,
      value: PropTypes.string,
      timestamp: PropTypes.string,
    }),
  ),
  healthcareCoverages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      coverage: PropTypes.string,
      value: PropTypes.string,
      timestamp: PropTypes.string,
    }),
  ),
  practitioners: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      practitioner: PropTypes.string,
      value: PropTypes.string,
      timestamp: PropTypes.string,
    }),
  ),
});

export const setIsCompositeProps = PropTypes.func;

export const setTabValueProps = PropTypes.func;

export const tabValueProps = PropTypes.string;

export const setCurrentFiltersProps = PropTypes.func;

export const setCurrentTimelineProps = PropTypes.func;

export const setTableFilterProps = PropTypes.func;

export const setDisplayDataProps = PropTypes.func;

export const tableFilterProps = PropTypes.arrayOf(
  PropTypes.shape({}),
);
export const handleTabChangeProps = PropTypes.func;

export const rowEntriesProps = PropTypes.arrayOf(
  PropTypes.shape({}),
);

export const graphWidthProps = PropTypes.number;
export const currentResultsProps = PropTypes.arrayOf(
  PropTypes.shape({
    date: PropTypes.string,
    denominator: PropTypes.number,
    exclusions: PropTypes.number,
    initialPopulation: PropTypes.number,
    label: PropTypes.string,
    measure: PropTypes.string,
    numerator: PropTypes.number,
    shortLabel: PropTypes.string,
    starRating: PropTypes.number,
    title: PropTypes.string,
    value: PropTypes.number,
  }),
);
export const setRowEntriesProps = PropTypes.func;
export const setSelectedMeasuresProps = PropTypes.func;
export const handleFilteredDataUpdateProps = PropTypes.func;
export const headerInfoProps = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string,
    link: PropTypes.bool,
    header: PropTypes.string,
    tooltip: PropTypes.string,
    flexBasis: PropTypes.string,
  }),
);
export const setFilterActivatedProps = PropTypes.func;
export const setIsLoadingProps = PropTypes.func;

export const trendsProps = PropTypes.arrayOf(PropTypes.shape({
  measure: PropTypes.string,
  precentChange: PropTypes.number,
  subScoreTrends: PropTypes.arrayOf(PropTypes.shape({
    measure: PropTypes.string,
    percentChange: PropTypes.number,
  })),
}));

export const widgetPrefsProps = PropTypes.shape({
  type: PropTypes.string,
  measure: PropTypes.string,
});

export const measureCheckerProps = PropTypes.shape({
  percentCheck: PropTypes.bool,
  starCheck: PropTypes.bool,
  submeasureCheck: PropTypes.bool,
});
