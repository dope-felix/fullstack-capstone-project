const config = {
  // Keep API requests on the page's origin so they also work through ngrok.
  backendUrl: (process.env.REACT_APP_BACKEND_URL || '').replace(/\/+$/, ''),
};

export { config as urlConfig };
