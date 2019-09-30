module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN : process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DB_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin@localhost/zomgpow',
  JWT_SECRET: process.env.JWT_SECRET || 'zomgpow-temp-secret'
};
