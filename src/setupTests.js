// Set the dev data env variable to populate app with data
process.env.REACT_APP_DEV_DATA = true;

// Set logic to replace crypto getRandomValues (needed for @azure/msal-browser)
Object.defineProperty(global.self, 'crypto', {
    value: {
        subtle: {
            digest: jest.fn()
        },
        getRandomValues: (arr) => {
            crypto.randomBytes(arr.length);
        }
    }
});

// Extend the timeout value
jest.setTimeout(70000);

// Set the global structrued clone
global.structuredClone = (val) => {
    return JSON.parse(JSON.stringify(val));
};
