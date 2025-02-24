// import { PublicClientApplication } from '@azure/msal-browser';
// import env from '../../env';

// // Instantiates the msalConfig used in Azure OAuth flow
// const msalConfig = {
//     auth: {
//         clientId: env.REACT_APP_AD_APP_ID,
//         authority: env.REACT_APP_AD_AUTHORITY,
//         redirectUri: env.REACT_APP_AD_REDIRECT_URI
//     },
//     cache: {
//         cacheLocation: 'localStorage',
//         storeAuthStateInCookie: true
//     }
// };

// // Initializes an msal instance
// export const msalInstance = new PublicClientApplication(msalConfig);

// // Login and get Azure AD OAuth token
// export const signInAndGetToken = async () => {
//     try {
//         const loginResponse = await msalInstance.loginPopup({
//             scopes: ['User.Read']
//         });

//         const account = loginResponse.account;
//         const tokenResponse = await msalInstance.acquireTokenSilent({
//             scopes: ['User.Read'],
//             account: account
//         });
//         // Returns token and user info
//         return {
//             token: tokenResponse.accessToken,
//             user: {
//                 name: account.name,
//                 email: account.username
//             }
//         };
//     } catch (error) {
//         console.error('Authentication failed:', error);
//     }
// };

// // Login redirect (after saving token)
// export const azRedirect = () => {
//     msalInstance.loginRedirect();
// };

// // Log out of Azure AD
// export const azLogout = () => {
//     // Redirect to login page
//     msalInstance.logoutRedirect();
//     // Microsoft confirmation of logout
//     msalInstance.logoutPopup();
// };
