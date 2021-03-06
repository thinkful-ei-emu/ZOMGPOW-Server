const express = require('express');
const path = require('path');
const RegistrationService = require('./registration-service');
const { requireAuth } = require('../middleware/jwt-auth');

const registrationRouter = express.Router();
const jsonBodyParser = express.json();

registrationRouter
  .post('/teacher', jsonBodyParser, async (req, res, next) => {
    try {
      const { password, full_name, email } = req.body;
      
      for (const field of ['full_name', 'password', 'email'])
        if (!req.body[field])
          return res.status(400).json({
            error: `Missing '${field}' in request body`
          });
      const passwordError = RegistrationService.validatePassword(password);

      if (passwordError)
        return res.status(400).json({ error: passwordError });

      const hasTeacherWithEmail = await RegistrationService.hasTeacherWithEmail(
        req.app.get('db'),
        email
      );

      if (hasTeacherWithEmail)
        return res.status(400).json({ error: 'Account with this email already exists' });

      const hashedPassword = await RegistrationService.hashPassword(password);

      const newUser = {
        full_name,
        password: hashedPassword,
        email,
      };

      const user = await RegistrationService.insertTeacherUser(
        req.app.get('db'),
        newUser
      );

      const firstClass = await RegistrationService.initialTeacherClass(
        req.app.get('db'),
        RegistrationService.formatTeacherForClass(user)
      );

      return res.status(204).end()
        
    } catch (error) {
      next(error);
    }
  });

registrationRouter
  .post('/student', requireAuth, jsonBodyParser, async (req, res, next) => {

    const { class_id, full_name } = req.body;

    if (!class_id) {
      return res.status(400).json({ error: 'Missing class id' })
    }
    if (!full_name) {
      return res.status(400).json({ error: 'Missing full name' })
    }

    try {
      let studentUserName = RegistrationService.createStudentUserName(full_name);

      let nameTaken = await RegistrationService.verifyStudentUserName(
        req.app.get('db'),
        studentUserName
      );

      if (nameTaken) {
        studentUserName = RegistrationService.generateNumForStudent(studentUserName);
      }

      const newUser = {
        user_name: studentUserName,
        full_name,
        class_id,
      }

      const user = await RegistrationService.insertStudentUser(
        req.app.get('db'),
        newUser
      );

      res
        .status(201)
        .json(RegistrationService.serializeStudentUser(user))
    }
    catch (error) {
      next(error);
    }
  });

module.exports = registrationRouter;
