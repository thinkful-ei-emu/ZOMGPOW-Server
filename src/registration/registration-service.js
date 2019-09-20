const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const RegistrationService = {
  hasTeacherWithEmail(db, email) {
    return db('teachers')
      .where({ email })
      .first()
      .then(user => !!user);
  },
  insertTeacherUser(db, newUser) {
    return db
      .insert(newUser)
      .into('teachers')
      .returning('*')
      .then(([user]) => user);
  },
  formatTeacherForClass(teacher){
    const class_title = `${teacher.full_name}'s class`;

    const classcode = Math.floor(Math.random() * Math.floor(999999));

    const teacher_id = teacher.id;

    return {
      class_title,
      classcode,
      teacher_id
    };
  },
  initialTeacherClass(db, classInfo){
    return db('classes')
      .insert(classInfo)
      .returning('*')
      .then(([newClass]) => newClass);
  },
  serializeClass(newClass){
    return {
      id: newClass.id,
      class_title: newClass.class_title,
      teacher_id: newClass.teacher_id,
      date_created: newClass.date_created
    };
  },
  insertStudentUser(db, newUser){
    return db
      .insert(newUser)
      .into('students')
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
      full_name: user.full_name,
      email: user.email,
    };
  },
  serializeStudentUser(user){
    return {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      class_id: user.class_id,
    };
  },
  createStudentUserName(full_name){
    // creates username formatted to first initial of first name plus last name
    let nameArr = full_name.split(' ');

    let userName = nameArr[0].charAt(0) + nameArr[1];

    return userName;
  },
  verifyStudentUserName(db, username){
    return db('students')
      .where('user_name', username)
      .first();
  },
  generateNumForStudent(username){
    // only called if student user name is already taken, adds three digit random number to UN
    let num = Math.floor(Math.random() * Math.floor(999));

    let newName = username + num;

    return newName;
  }

};

module.exports = RegistrationService;
