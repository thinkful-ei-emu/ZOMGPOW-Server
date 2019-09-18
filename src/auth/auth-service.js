const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const authService = {
  getUserWithEmail(db, email){
    return db('teacher')
      .where({email})
      .first();
  },
  comparePasswords(password, hash){
    return bcrypt.compare(password, hash);
  },
  createJWT(subject, payload){
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm:'HS256',
    });
  },
  verifyJwt(token){
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

module.exports = authService;