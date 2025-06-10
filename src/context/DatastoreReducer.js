import { updateTimestamp } from '../components/Utilities/GeneralUtil';
import { calcMemberResults } from '../components/Utilities/ChartUtils';

const chartColorArray = [
  '#88CCEE',
  '#CC6677',
  '#DDCC77',
  '#117733',
  '#332288',
  '#AA4499',
  '#44AA99',
  '#999933',
  '#661100',
  '#6699CC',
  '#888888',
];

const defaultFilterState = {
  domainsOfCare: [],
  stars: [],
  percentRange: [0, 100],
  sum: 0,
  payors: [],
  healthcareProviders: [],
  healthcareCoverages: [],
  healthcarePractitioners: [],
};
const defaultTimelineState = {
  choice: 'all', // 30, 60, ytd or custom.
  range: [0, 100],
};

export const initialState = {
  datastoreLoading: true,
  status: undefined,
  results: [], // All results for the last several days, per measure.
  memberResults: [],
  trends: [],
  preferences: {
    ratingTrends: {
      0: {
        type: 'star',
        measure: 'composite',
      },
      1: {
        type: 'percentage',
        measure: 'composite',
      },
      2: {
        type: 'percentage',
        measure: 'aise-4',
      },
      3: {
        type: 'star',
        measure: 'bcse',
      },
    },
    theme: 'light',
  },
  currentResults: [], // Results for the most recent day for each measure.
  info: {},
  lastUpdated: 'Updating now...',
  defaultFilterState,
  chartColorArray,
  defaultTimelineState,
  filterOptions: {
    payors: [],
    healthcareProviders: [],
    healthcareCoverages: [],
    healthcarePractitioners: [],
  },
  measurementYear: (() => {
    const stored = parseInt(localStorage.getItem('selectedYear'), 10);
    return [2022, 2025].includes(stored) ? stored : 2025;
  })(),
  comparisonMode: 'default',
  refresh: 0,
  measureAvgValue: 71.05,
};

export const DatastoreReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RESULTS': {
      const { results, info } = action.payload;
      const { currentResults } = calcMemberResults(results, info, state.comparisonMode !== 'default');
      return {
        ...state,
        results,
        currentResults,
        info,
        lastUpdated: updateTimestamp(new Date()),
      };
    }
    case 'SET_MEMBER_RESULTS': {
      return {
        ...state,
        memberResults: action.payload,
      };
    }
    case 'SET_TRENDS':
      return {
        ...state,
        trends: action.payload,
        lastUpdated: updateTimestamp(new Date()),
      };
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: action.payload,
      };
    case 'SET_FILTER_OPTIONS':
      return {
        ...state,
        defaultFilterState: {
          ...state.defaultFilterState,
        },
        filterOptions: {
          payors: action.payload.payors,
          healthcareProviders: action.payload.healthcareProviders,
          healthcareCoverages: action.payload.healthcareCoverages,
          healthcarePractitioners: action.payload.practitioners,
        },
      };
    case 'SET_ISLOADING':
      return {
        ...state,
        datastoreLoading: action.payload,
        lastUpdated: updateTimestamp(new Date()),
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    case 'SET_MEASUREMENT_YEAR':
      localStorage.setItem('selectedYear', action.payload);
      return {
        ...state,
        measurementYear: action.payload,
      };
    case 'SET_COMPARISON_MODE':
      return {
        ...state,
        comparisonMode: action.payload.comparisonMode,
      };
    case 'UPDATE_REFRESH':
      return {
        ...state,
        refresh: state.refresh + 1,
      }
    default:
      return state;
  }
};
