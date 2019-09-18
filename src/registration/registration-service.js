const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const RegistrationService = {
  hasTeacherWithName(db, full_name) {
    return db('teacher')
      .where({ full_name })
      .first()
      .then(user => !!user);
  },
  insertTeacherUser(db, newUser) {
    return db
      .insert(newUser)
      .into('teacher')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeTeacherUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
  },
};

module.exports = RegistrationService;
