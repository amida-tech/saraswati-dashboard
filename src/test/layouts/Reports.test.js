import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Reports from 'layouts/Reports';
import DatastoreProvider from 'context/DatastoreProvider';

function assertReports() {
    const links = screen.getAllByRole('link');
    const getReportBtn = links[links.length - 1];
    act(() => {
        fireEvent.click(getReportBtn);
    });
    expect(getReportBtn).toBeInTheDocument();
}

describe('Reports.js', () => {
    it('renders as expected', () => {
        process.env.REACT_APP_MVP_SETTING = true;
        render(
            <DatastoreProvider>
                <Reports />
            </DatastoreProvider>
        );
        assertReports();
    });

    it('renders as expected', () => {
        process.env.REACT_APP_MVP_SETTING = false;
        render(
            <DatastoreProvider>
                <Reports />
            </DatastoreProvider>
        );
        assertReports();
    });
});
