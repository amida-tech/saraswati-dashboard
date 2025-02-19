import {
    filterByTimeline,
    expandSubMeasureResults,
    getSubMeasureCurrentResults,
    getSubMeasureCurrentResultsPerMeasure,
    createLabel,
    createSubMeasureLabel
} from 'components/ChartContainer/D3ContainerUtils';
import { mockInfo } from 'test/resources/constants/ChartContainerConstants';
import { mockMeasure } from 'test/resources/constants/ChartContainerConstants';
import { mockActiveMeasure } from 'test/resources/constants/ChartContainerConstants';
import {
    mockTimeline,
    mockTimelineDisplayData,
    mockSelectedMeasure,
    mockResults,
    mockCurrentResults
} from 'test/resources/constants/ChartContainerConstants';

beforeAll(() => {
    // Control passing of time for testing
    jest.useFakeTimers('modern');
    // Set the fake system time to a fixed date
    jest.setSystemTime(new Date('2025-02-03T10:00:00Z'));
});

afterAll(() => {
    // Restore real timers and the original Date
    jest.useRealTimers();
});

// filterByTimeline
describe('filterByTimeLine', () => {
    it('30 day filter yields expected result', () => {
        const result = filterByTimeline(
            mockTimelineDisplayData,
            mockTimeline('30')
        );
        expect(result.length).toBe(690);
        expect(result).toBeInstanceOf(Array);
    });

    it('90 day filter yields expected result', () => {
        const result = filterByTimeline(
            mockTimelineDisplayData,
            mockTimeline('90')
        );
        expect(result.length).toBe(966);
        expect(result).toBeInstanceOf(Array);
    });

    it('YTD filter yields expected result', () => {
        const result = filterByTimeline(
            mockTimelineDisplayData,
            mockTimeline('YTD')
        );
        expect(result.length).toBe(759);
        expect(result).toBeInstanceOf(Array);
    });

    it('YTD filter yields expected result', () => {
        const result = filterByTimeline(
            mockTimelineDisplayData,
            mockTimeline('all')
        );
        expect(result.length).toBe(966);
        expect(result).toBeInstanceOf(Array);
    });
});

// expandSubMeasureResults
describe('expandSubMeasureResults util', () => {
    it('functions as expected', () => {
        const result = expandSubMeasureResults(
            mockSelectedMeasure,
            mockResults
        );
        expect(result.length).toBe(80);
        expect(result).toBeInstanceOf(Array);
    });
});

// getSubMeasureCurrentResults
describe('getSubMeasureCurrentResults util', () => {
    it('functions as expected', () => {
        const result = getSubMeasureCurrentResults(
            mockSelectedMeasure,
            mockCurrentResults
        );
        expect(result.length).toBe(5);
        expect(result).toBeInstanceOf(Array);
    });

    it('functions as expected', () => {
        const result = getSubMeasureCurrentResults(
            mockActiveMeasure,
            mockCurrentResults
        );
        expect(result.length).toBe(5);
        expect(result).toBeInstanceOf(Array);
    });

    it('functions as expected', () => {
        const result = getSubMeasureCurrentResults({}, []);
        expect(result.length).toBe(1);
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(undefined);
    });
});

// getSubMeasureCurrentResultsPerMeasure
describe('getSubMeasureCurrentResultsPerMeasure util', () => {
    it('functions as expected', () => {
        const result = getSubMeasureCurrentResultsPerMeasure(
            mockSelectedMeasure,
            mockCurrentResults
        );
        expect(result.length).toBe(1);
        expect(result).toBeInstanceOf(Array);
    });

    it('functions as expected', () => {
        const result = getSubMeasureCurrentResultsPerMeasure({}, []);
        expect(result.length).toBe(1);
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(undefined);
    });
});

// createLabel
describe('createLabel util', () => {
    it('functions as expected for ima-e', () => {
        const result = createLabel(mockMeasure, mockInfo);
        expect(result).toBe('IMA-E - Immunizations for Adolescents');
    });
    it('functions as expected for Composite', () => {
        const result = createLabel('composite', mockInfo);
        expect(result).toBe('Composite - Composite Score');
    });
});
