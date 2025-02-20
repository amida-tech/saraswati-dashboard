import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
    signInAndGetToken,
    azRedirect,
    azLogout,
    msalInstance
} from 'views/auth/AuthService';
import {
    mockDefaultTestAuthenticationResult,
    mockAccessToken,
    mockAzureSignInResponse
} from 'test/resources/constants/AuthServiceConstants';
import Login from 'views/auth/Login';

// Mock the PCA Constructor and it's methods
jest.mock('@azure/msal-browser', () => {
    return {
        PublicClientApplication: jest.fn().mockImplementation(() => {
            return {
                loginPopup: async () =>
                    Promise.resolve(mockDefaultTestAuthenticationResult),
                acquireTokenSilent: async () =>
                    Promise.resolve(mockDefaultTestAuthenticationResult),
                loginRedirect: jest.fn(),
                acquireTokenPopup: jest.fn(),
                acquireTokenRedirect: jest.fn(),
                logout: jest.fn(),
                logoutRedirect: jest.fn(),
                logoutPopup: jest.fn(),
                getAllAccounts: jest.fn(),
                getAccountByUsername: jest.fn(),
                handleRedirectPromise: jest.fn()
            };
        })
    };
});

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
    it('returns the correct response from signInAndGetToken', async () => {
        // Call signInAndGetToken
        const result = await signInAndGetToken();
        // Assert the correct response
        expect(result).toStrictEqual(mockAzureSignInResponse);
    });

    it('azRedirect calls loginRedirect', () => {
        // Call azRedirect
        azRedirect();
        // Assert loginRedirect was called
        expect(msalInstance.loginRedirect).toHaveBeenCalled();
    });

    it('azLogout calls logoutRedirect & logoutPopup', () => {
        // Call azLogout
        azLogout();
        // Assert logoutRedirect & logoutPopup were called
        expect(msalInstance.logoutRedirect).toHaveBeenCalled();
        expect(msalInstance.logoutPopup).toHaveBeenCalled();
    });

    it('handleLoginAz from Login.js functions as expected', async () => {
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
        expect(token).toBe(mockAccessToken);
    });
});
