import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signInAndGetToken } from 'views/auth/AuthService';
import Login from 'views/auth/Login';

beforeAll(() => {
    // Control passing of time for testing
    jest.useFakeTimers('modern');
    // Set the fake system time to a fixed date
    jest.setSystemTime(new Date('2025-02-03T10:00:00Z'));
});

afterAll(() => {
    // Restore real timers and the original Date
    jest.useRealTimers();
    // Restore all mocks
    jest.restoreAllMocks();
});

afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
});

describe('AuthService.js', () => {
    // Mock the PCA Constructor and it's methods
    jest.mock('@azure/msal-browser', () => {
        return {
            PublicClientApplication: jest.fn().mockImplementation(() => {
                return {
                    loginPopup: jest.fn(),
                    acquireTokenSilent: jest.fn(),
                    loginRedirect: jest.fn()
                };
            })
        };
    });
    it('gracefully fails when no response', async () => {
        const errorSpy = jest.spyOn(console, 'error');
        // Call signInAndGetToken
        await signInAndGetToken();
        // Assert the correct response
        expect(errorSpy).toHaveBeenCalled();
    });

    it('handleLoginAz gracefully fails', async () => {
        render(<Login />);
        // Identify the msftLoginBtn
        const msftLoginBtn = screen.getByText(/Sign in with Microsoft/i);
        // Click the msftLoginBtn
        await waitFor(() => {
            fireEvent.click(msftLoginBtn);
        });
        // Get the 'azToken' item from local storage
        const token = localStorage.getItem('azToken');
        // Assert the correct token is in place
        expect(token).toBe(null);
    });
});
