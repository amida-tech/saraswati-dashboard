import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from 'components/Common/Navbar';
import '@azure/msal-browser';

// Mock azLogout from AuthService
jest.mock('views/auth/AuthService', () => {
    return {
        azLogout: jest.fn()
    };
});
// Mock @azure/msal-browser
jest.mock('@azure/msal-browser');

function assertNav() {
    const navMenu = screen.getByTestId('AccountCircleOutlinedIcon');
    act(() => {
        fireEvent.click(navMenu);
    });
    const logout = screen.getByText(/Logout/i);
    act(() => {
        fireEvent.click(logout);
    });
    expect(navMenu && logout).toBeInTheDocument();
}

describe('Navbar.js', () => {
    it('can open the navMenu & logout', () => {
        // Render the Navbar
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        assertNav();
    });

    it('can perform azLogout when azToken is set in local storage', () => {
        // Set the localStorage item azToken
        localStorage.setItem('azToken', 'mock-token');
        
        // Render the Navbar
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        assertNav();
    });
});
