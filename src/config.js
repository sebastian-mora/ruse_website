const BUILD_ENV = process.env.REACT_APP_BUILD_ENV;

export const API_ENDPOINT =
  BUILD_ENV === "dev"
    ? "https://api.ruse.tech/dev" // Use the production endpoint
    : "https://api.ruse.tech"; // Use the development endpoint or any other desired value for 'dev'
