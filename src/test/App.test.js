import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

function assertLoginButtons() {
    waitFor(() => {
        // Finds the google login & asserts it is in the document
        const googleLoginBtn = screen.getByText(/Sign in with Google/i);
        expect(googleLoginBtn).toBeInTheDocument();
        // Finds the microsoft login & asserts it is in the document
        const msftLoginBtn = screen.getByText(/Sign in with Microsoft/i);
        expect(msftLoginBtn).toBeInTheDocument();
    });
}

describe('The App.js component - ', () => {
    it('renders the Login page as expected', async () => {
        // Render the main App (login page)
        render(<App />);
        assertLoginButtons();
    });

    it('handles state as expected for google login', async () => {
        // Spy on URLSearchParams w/ mock returned value
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(
            'mock-token'
        );

        // Render the main App (login page)
        render(<App />);

        // Assert some dashboard components have rendered correctly
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(1);
        assertLoginButtons();
    });
});
