import {
  fireEvent, render, screen,
} from '@testing-library/react';
import FilterDrawer from '../../../components/FilterMenu/FilterDrawer';
import { additionalFilterOptions } from '../../data/DemoData';

const filters = {
  domainsOfCare: [],
  stars: [],
  percentRange: [0, 100],
  sum: 0,
  payors: [],
  healthcareProviders: [],
  healthcareCoverages: [],
  healthcarePractitioners: [],
};

const mockHandleFilterChange = jest.fn(() => false);
const mockToggleFilterDrawer = jest.fn(() => false);
const mockHandleResetData = jest.fn(() => false);
const emptyFunction = jest.fn(() => false);

const clickNCheck = (boxes, values) => Object.entries(values).forEach(([key, value]) => {
  if (value) {
    fireEvent.click(boxes.find((box) => box.value === key));
  }
  expect(value ? boxes.find((box) => box.checked) : boxes.find((box) => !box.checked));
});

const simpleCheck = (boxes, values) => Object.values(values).forEach((value) => {
  expect(value ? boxes.find((box) => box.checked) : boxes.find((box) => !box.checked));
});

const closeOpenDrawerTest = (rerender) => {
  rerender(<FilterDrawer
    filterDrawerOpen={false}
    currentFilters={filters}
    additionalFilterOptions={additionalFilterOptions}
    handleFilterChange={mockHandleFilterChange}
    toggleFilterDrawer={mockToggleFilterDrawer}
    setFilterActivated={emptyFunction}
    setIsLoading={emptyFunction}
    setIsComposite={emptyFunction}
    setTableFilter={emptyFunction}
    setRowEntries={emptyFunction}
    handleResetData={emptyFunction}
  />);
  const refineByText = screen.queryByText('Refine by');
  expect(refineByText).toBe(null);
  rerender(<FilterDrawer
    filterDrawerOpen
    currentFilters={filters}
    additionalFilterOptions={additionalFilterOptions}
  />);
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
        setFilterActivated={emptyFunction}
        setIsLoading={emptyFunction}
        setIsComposite={emptyFunction}
        setTableFilter={emptyFunction}
        setRowEntries={emptyFunction}
        handleResetData={emptyFunction}
      />,
    );

    // grab the slider points
    const sliderPoints = screen.getAllByLabelText('Measurement percentage range');
    expect(sliderPoints.length).toBe(2);
    const startPoint = sliderPoints[0];
    const endPoint = sliderPoints[1];

    // values of slider points -- aria-valuetext OR aria-valuenow --
    // to match given filter percentageRange value
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
        currentFilters={filters}
        additionalFilterOptions={additionalFilterOptions}
        handleFilterChange={mockHandleFilterChange}
        toggleFilterDrawer={mockToggleFilterDrawer}
        setFilterActivated={emptyFunction}
        setIsLoading={emptyFunction}
        setIsComposite={emptyFunction}
        setTableFilter={emptyFunction}
        setRowEntries={emptyFunction}
        handleResetData={emptyFunction}
      />,
    );

    // grab all checkboxes on DOM, select which we want checked with 'true'
    const checkboxes = [...screen.getAllByRole('checkbox')];
    const expectedValues = {
      EOC: false,
      ECDS: true,
      1: false,
      2: true,
      3: true,
      4: false,
      5: false,
    };

    // for each of values to be tested, we will click or not
    // expect box to be sucessefully checked or not
    clickNCheck(checkboxes, expectedValues);
    fireEvent.click(getByText('Apply Filters'));

    // we expect our handleFilterChange function to be called with appropriate filters
    expect(mockHandleFilterChange).toHaveBeenCalledWith({
      domainsOfCare: ['ECDS'],
      stars: [2, 3],
      percentRange: [0, 100],
      sum: 3,
      healthcareCoverages: [],
      healthcarePractitioners: [],
      healthcareProviders: [],
      payors: [],
    });
    expect(mockToggleFilterDrawer).toHaveBeenCalled();

    rerender(<FilterDrawer
      filterDrawerOpen={false}
      currentFilters={filters}
      additionalFilterOptions={additionalFilterOptions}
      handleFilterChange={mockHandleFilterChange}
      toggleFilterDrawer={mockToggleFilterDrawer}
      setFilterActivated={emptyFunction}
      setIsLoading={emptyFunction}
      setIsComposite={emptyFunction}
      setTableFilter={emptyFunction}
      setRowEntries={emptyFunction}
      handleResetData={emptyFunction}
    />);
    const refineByText = screen.queryByText('Refine by');
    expect(refineByText).toBe(null);

    rerender(<FilterDrawer
      filterDrawerOpen
      currentFilters={filters}
      additionalFilterOptions={additionalFilterOptions}
      handleFilterChange={mockHandleFilterChange}
      toggleFilterDrawer={mockToggleFilterDrawer}
      setFilterActivated={emptyFunction}
      setIsLoading={emptyFunction}
      setIsComposite={emptyFunction}
      setTableFilter={emptyFunction}
      setRowEntries={emptyFunction}
      handleResetData={emptyFunction}
    />);

    simpleCheck(checkboxes, expectedValues);
  });

  test('resets to the default filter state', () => {
    render(
      <FilterDrawer
        filterDrawerOpen
        handleFilterChange={mockHandleFilterChange}
        currentFilters={filters}
        additionalFilterOptions={additionalFilterOptions}
        toggleFilterDrawer={mockToggleFilterDrawer}
        handleResetData={mockHandleResetData}
        setFilterActivated={emptyFunction}
        setIsLoading={emptyFunction}
        setIsComposite={emptyFunction}
        setTableFilter={emptyFunction}
        setRowEntries={emptyFunction}
      />,
    );

    // grab all checkboxes on DOM, select which we want checked with 'true'
    const checkboxes = [...screen.getAllByRole('checkbox')];
    const expectedValues = {
      EOC: true,
      ECDS: false,
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
    };

    clickNCheck(checkboxes, expectedValues);

    fireEvent.click(screen.getByRole('button', { name: 'Reset Filters' }));
    expect(mockHandleResetData).toHaveBeenCalled();
    expect(mockToggleFilterDrawer).toHaveBeenCalled();
  });

  test('cancels the filter changes', () => {
    const { rerender } = render(
      <FilterDrawer
        filterDrawerOpen
        currentFilters={filters}
        additionalFilterOptions={additionalFilterOptions}
        handleFilterChange={mockHandleFilterChange}
        toggleFilterDrawer={mockToggleFilterDrawer}
        setFilterActivated={emptyFunction}
        setIsLoading={emptyFunction}
        setIsComposite={emptyFunction}
        setTableFilter={emptyFunction}
        setRowEntries={emptyFunction}
        handleResetData={emptyFunction}
      />,
    );

    // grab all checkboxes on DOM, select which we want checked with 'true'
    const checkboxes = [...screen.getAllByRole('checkbox')];
    const expectedValues = {
      EOC: false,
      ECDS: true,
      1: false,
      2: true,
      3: true,
      4: false,
      5: false,
    };

    // for each of values to be tested, we will click or not
    // expect box to be sucessefully checked or not
    clickNCheck(checkboxes, expectedValues);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockToggleFilterDrawer).toHaveBeenCalled();

    closeOpenDrawerTest(rerender);
  });
});
