import { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider } from '@emotion/react';
import { validateAccessToken } from './components/Common/Controller';
import theme from './assets/styles/AppTheme';
import Auth from './layouts/Auth';
import ProtectedRoutes from './ProtectedRoutes';
import { msalInstance } from 'views/auth/AuthService';

function MainContent() {
    // State for whether user is authenticated or not
    const [authenticated, setAuthenticated] = useState(false);
    // State for whether data is returned from api call or not
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check for .env first.
        if (`${process.env.REACT_APP_AUTH}` === 'false') {
            setIsLoaded(true);
            setAuthenticated(true);

            return;
        }
        // Destructures the hash property from URL
        const { hash } = window.location;
        // Creates a URLSearchParams obj to parse the hash string into kv pairs
        const urlParams = new URLSearchParams(hash);
        // Google OAuth token
        let accessToken = urlParams.get('access_token');
        // Check if there is Google OAuth token
        if (accessToken) {
            // Add the token to local storage
            localStorage.setItem('token', accessToken);
            // Set authenticated and loaded to true
            setAuthenticated(true);
            setIsLoaded(true);
            // Updates the URL without loading
            window.history.replaceState({}, document.title, '/');
            return;
        }
        // Sets the Google accessToken from storage
        accessToken = localStorage.getItem('token');
        // Check if Google access token exists
        if (accessToken) {
            // Check the existing token
            validateAccessToken(accessToken).then((loggedIn) => {
                setAuthenticated(loggedIn);
                setIsLoaded(true);
            });
            // Check if AZ access token exists
        } else if (localStorage.getItem('azToken')) {
            // Set authenticated and loaded to true
            setAuthenticated(true);
            setIsLoaded(true);
            // Updates the URL without loading
            window.history.replaceState({}, document.title, '/');
        } else {
            // Only sets loaded to true
            setIsLoaded(true);
        }
    }, [
        setAuthenticated,
        setIsLoaded,
        authenticated
    ]);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    {/* AUTH PAGE */}
                    <Route path='/auth'>
                        <Auth />
                    </Route>
                    {isLoaded &&
                        (authenticated ? (
                            // PROTECTED ROUTES
                            <ProtectedRoutes loggedIn={authenticated} />
                        ) : (
                            <Redirect to='/auth' />
                        ))}
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default function App() {
    return (
        // AZ AUTH PROVIDER
        <MsalProvider instance={msalInstance}>
            <MainContent />
        </MsalProvider>
    );
}
