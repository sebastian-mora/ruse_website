export const API_ENDPOINT = process.env.ENV === 'prod'
    ? 'https://api.ruse.tech'  // Use the production endpoint
    : 'https://api.ruse.tech/dev'; // Use the development endpoint or any other desired value for 'dev'
