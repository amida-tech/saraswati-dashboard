import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from 'layouts/Dashboard';
import { BrowserRouter, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import DatastoreProviderWrapper from 'context/DatastoreProviderWrapper';
import { ThemeProvider } from '@emotion/react';
import theme from '../../assets/styles/AppTheme';
import '@testing-library/jest-dom';

describe('The Dashboard component', () => {
    it('renders as expected', async () => {
        const history = createMemoryHistory();
        const route = '/';
        history.push(route);
        // Render the main App (login page)
        render(
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Route history={history}>
                        <DatastoreProviderWrapper>
                            <Dashboard />
                        </DatastoreProviderWrapper>
                    </Route>
                </BrowserRouter>
            </ThemeProvider>
        );
        // Define, assert existence, and click the filter menu button
        const filterMenuBtn = screen.getByText(/filter/i);
        await waitFor(() => {
            expect(filterMenuBtn).toBeInTheDocument();
        });
        fireEvent.click(filterMenuBtn);

        // Define, assert existence, and click the reset filters button
        const resetFiltersBtn = screen.getByText(/Reset Filters/i);
        await waitFor(() => {
            expect(resetFiltersBtn).toBeInTheDocument();
        });
        fireEvent.click(resetFiltersBtn);

        // Assert that the menu closed & the button is no longer exists
        await waitFor(() => {
            expect(screen.queryByText(/Reset Filters/i)).toBeNull();
        });
    });
});
