import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Asserts text appears once in the document
function assertText(text) {
    expect(screen.getByText(text)).toBeInTheDocument();
}

describe('The App.js component without Auth ', () => {
    // Instantiate holder for original auth env variable
    let originalAuthEnv;
    // Persist the original auth env variable
    beforeAll(() => {
        originalAuthEnv = process.env.REACT_APP_AUTH;
    });
    // Set the auth env variable back
    afterAll(() => {
        process.env.REACT_APP_AUTH = originalAuthEnv;
    });

    it('displays the dashboard with test data loaded', async () => {
        // Change the app to not require auth
        process.env.REACT_APP_AUTH = false;
        // Render the main App (login page)
        render(<App />);
        await waitFor(() => {
            // Wait for the App to render and assert the title is in the document
            assertText('Saraswati');
        });
        // Assert some dashboard components have rendered correctly
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(11);
        assertText('HEDIS Dashboard');
        assertText('Composite Score % Change');
    });
});
