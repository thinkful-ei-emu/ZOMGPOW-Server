module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
<<<<<<< HEAD
  DB_URL: process.env.DATABASE_URL || 'postgresql://zomgpow-app:team@localhost/zomgpow-app',
=======
  DB_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin@localhost/zomgpow',
>>>>>>> 2bd2b94a4972d4c286ba66b14a417b7d5b9e9a0e
  JWT_SECRET: process.env.JWT_SECRET || 'zomgpow-temp-secret'
};
