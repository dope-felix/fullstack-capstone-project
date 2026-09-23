const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // The browser uses /api on the frontend URL; only this server calls localhost.
  app.use('/api', createProxyMiddleware({
    target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:3060',
    changeOrigin: true,
    xfwd: true,
  }));
};
