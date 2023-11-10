const BUILD_ENV = process.env.REACT_APP_BUILD_ENV || "dev"

export const API_ENDPOINT = BUILD_ENV === 'prod'
    ? 'https://api.ruse.tech'  // Use the production endpoint
    : 'https://api.ruse.tech/dev'; // Use the development endpoint or any other desired value for 'dev'
