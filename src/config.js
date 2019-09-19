module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'zomgpow-temp-secret',
  DB_URL: process.env.DB_URL || 'postgresql://dunder-mifflin@localhost/zomgpow',
};