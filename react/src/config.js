const config = {
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
  },
  api: {
    API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
    API_KEY: process.env.REACT_APP_API_KEY,
  },
};

export default config;
