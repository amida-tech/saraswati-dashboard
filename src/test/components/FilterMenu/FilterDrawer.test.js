import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterDrawer from '../../../components/FilterMenu/FilterDrawer';
import { default as datastore } from '../../data/datastore';

const filters = {
    domainsOfCare: [],
    stars: [],
    percentRange: [0, 100],
    sum: 0,
    payors: [],
    healthcareCoverages: [],
    healthcarePractitioners: [],
    healthcareProviders: []
};

const mockHandleFilterChange = jest.fn(() => false);
const mockToggleFilterDrawer = jest.fn(() => false);

const givenPropsTest = async (getByText) => {
    expect(getByText('Apply Filters')).toBeTruthy();
    expect(screen.getByDisplayValue('EOC').checked).toBe(false);
    expect(screen.getByDisplayValue('ECDS').checked).toBe(false);
    expect(screen.getByDisplayValue('1').checked).toBe(false);
    expect(screen.getByDisplayValue('2').checked).toBe(false);
};

const closeOpenDrawerTest = async (rerender) => {
    rerender(
        <FilterDrawer
            filterDrawerOpen={false}
            handleFilterChange={mockHandleFilterChange}
            currentFilters={filters}
            toggleFilterDrawer={mockToggleFilterDrawer}
            additionalFilterOptions={datastore.filterOptions}
        />
    );
    const refineByText = screen.queryByText('Refine by');
    expect(refineByText).toBe(null);
    rerender(
        <FilterDrawer
            filterDrawerOpen
            handleFilterChange={mockHandleFilterChange}
            currentFilters={filters}
            toggleFilterDrawer={mockToggleFilterDrawer}
            additionalFilterOptions={datastore.filterOptions}
        />
    );
};

// TO DO: Write test for the slider. https://stackoverflow.com/questions/58856094/testing-a-material-ui-slider-with-testing-library-react
describe('FilterDrawer', () => {
    test('MUI slider values renders default values and can be adjusted', () => {
        render(
            <FilterDrawer
                filterDrawerOpen
                handleFilterChange={mockHandleFilterChange}
                currentFilters={filters}
                toggleFilterDrawer={mockToggleFilterDrawer}
            />
        );

        // grab the slider points
        const sliderPoints = screen.getAllByLabelText(
            'Measurement percentage range'
        );
        expect(sliderPoints.length).toBe(2);
        const startPoint = sliderPoints[0];
        const endPoint = sliderPoints[1];

        // values of slider points -- aria-valuetext OR aria-valuenow -- to match given filter percentageRange value
        expect(startPoint.getAttribute('aria-valuenow')).toBe('0');
        expect(endPoint.getAttribute('aria-valuenow')).toBe('100');

        expect(startPoint.getAttribute('max')).toBe('100');
        expect(startPoint.getAttribute('min')).toBe('0');

        expect(endPoint.getAttribute('max')).toBe('100');
        expect(endPoint.getAttribute('min')).toBe('0');

        // move pointers to new values
        fireEvent.change(startPoint, { target: { value: 25 } });
        fireEvent.change(endPoint, { target: { value: 75 } });

        expect(startPoint.getAttribute('aria-valuenow')).toBe('25');
        expect(endPoint.getAttribute('aria-valuenow')).toBe('75');
    });

    test('checks that the filter is applied', () => {
        const { getByText, rerender } = render(
            <FilterDrawer
                filterDrawerOpen
                handleFilterChange={mockHandleFilterChange}
                toggleFilterDrawer={mockToggleFilterDrawer}
                currentFilters={{
                    domainsOfCare: [],
                    stars: [],
                    percentRange: [0, 100],
                    sum: 0,
                    payors: [],
                    healthcareCoverages: [],
                    healthcarePractitioners: [],
                    healthcareProviders: []
                }}
                additionalFilterOptions={datastore.filterOptions}
            />
        );

        fireEvent.click(screen.getByDisplayValue('ECDS'));
        fireEvent.click(screen.getByDisplayValue('2'));
        fireEvent.click(screen.getByDisplayValue('3'));

        expect(screen.getByDisplayValue('EOC').checked).toBe(false);
        expect(screen.getByDisplayValue('ECDS').checked).toBe(true);
        expect(screen.getByDisplayValue('1').checked).toBe(false);
        expect(screen.getByDisplayValue('2').checked).toBe(true);
        expect(screen.getByDisplayValue('3').checked).toBe(true);
        expect(screen.getByDisplayValue('4').checked).toBe(false);
        expect(screen.getByDisplayValue('5').checked).toBe(false);

        fireEvent.click(getByText('Apply Filters'));
        expect(mockHandleFilterChange).toHaveBeenCalledWith({
            domainsOfCare: ['ECDS'],
            stars: [2, 3],
            percentRange: [0, 100],
            sum: 3,
            healthcareCoverages: [],
            healthcarePractitioners: [],
            healthcareProviders: [],
            payors: []
        });
        expect(mockToggleFilterDrawer).toHaveBeenCalledWith(false);

        rerender(
            <FilterDrawer
                filterDrawerOpen={false}
                handleFilterChange={mockHandleFilterChange}
                toggleFilterDrawer={mockToggleFilterDrawer}
                currentFilters={{
                    domainsOfCare: [],
                    stars: [],
                    percentRange: [0, 100],
                    sum: 0,
                    payors: [],
                    healthcareCoverages: [],
                    healthcarePractitioners: [],
                    healthcareProviders: []
                }}
                additionalFilterOptions={datastore.filterOptions}
            />
        );
        const refineByText = screen.queryByText('Refine by');
        expect(refineByText).toBe(null);

        rerender(
            <FilterDrawer
                filterDrawerOpen
                currentFilters={filters}
                additionalFilterOptions={datastore.filterOptions}
            />
        );
        expect(screen.getByDisplayValue('ECDS').checked).toBe(true);
        expect(screen.getByDisplayValue('2').checked).toBe(true);
        expect(screen.getByDisplayValue('3').checked).toBe(true);
    });

    test('resets to the default filter state', async () => {
        const { getByText, rerender } = render(
            <FilterDrawer
                filterDrawerOpen
                handleFilterChange={mockHandleFilterChange}
                currentFilters={filters}
                toggleFilterDrawer={mockToggleFilterDrawer}
                additionalFilterOptions={datastore.filterOptions}
            />
        );

        givenPropsTest(getByText);
        const resetFiltersBtn = screen.getByText(/Reset Filters/i);
        expect(resetFiltersBtn).toBeInTheDocument();
        await act(() => {
            fireEvent.click(resetFiltersBtn);
        });
        expect(mockToggleFilterDrawer).toHaveBeenCalledWith(false);

        closeOpenDrawerTest(rerender);
        expect(screen.getByDisplayValue('EOC').checked).toBe(false);
        expect(screen.getByDisplayValue('ECDS').checked).toBe(false);
        expect(screen.getByDisplayValue('1').checked).toBe(false);
        expect(screen.getByDisplayValue('2').checked).toBe(false);
    });

    test('cancels the filter changes', () => {
        const { getByText, rerender } = render(
            <FilterDrawer
                filterDrawerOpen
                handleFilterChange={mockHandleFilterChange}
                currentFilters={filters}
                toggleFilterDrawer={mockToggleFilterDrawer}
                additionalFilterOptions={datastore.filterOptions}
            />
        );

        givenPropsTest(getByText);
        expect(screen.getByDisplayValue('ECDS').checked).toBe(false);
        expect(screen.getByDisplayValue('2').checked).toBe(false);
        fireEvent.click(screen.getByDisplayValue('ECDS'));
        fireEvent.click(screen.getByDisplayValue('2'));
        expect(screen.getByDisplayValue('ECDS').checked).toBe(true);
        expect(screen.getByDisplayValue('2').checked).toBe(true);

        fireEvent.click(getByText('Cancel'));
        expect(mockToggleFilterDrawer).toHaveBeenCalledWith(false);
        expect(mockHandleFilterChange).not.toHaveBeenCalled();

        closeOpenDrawerTest(rerender);
        expect(screen.getByDisplayValue('ECDS').checked).toBe(false);
        expect(screen.getByDisplayValue('2').checked).toBe(false);
    });
});
