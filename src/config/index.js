require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'AtendimentoBR BRDID Proxy',
  brdid: {
    apiUrl: process.env.BRDID_API_URL || 'https://brdid.com.br/br-did/api/public',
    token: process.env.BRDID_TOKEN,
  },
};
