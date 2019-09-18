const express = require('express');
const path = require('path');
const RegistrationService = require('./registration-service');

const registrationRouter = express.Router();
const jsonBodyParser = express.json();

registrationRouter
  .post('/teacher', jsonBodyParser, async (req, res, next) => {
    const { password, full_name, email } = req.body;

    for (const field of ['full_name', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    try {
      const passwordError = RegistrationService.validatePassword(password);

      if (passwordError)
        return res.status(400).json({ error: passwordError });

      const hasTeacherWithEmail = await RegistrationService.hasTeacherWithEmail(
        req.app.get('db'),
        email
      );

      if (hasTeacherWithEmail)
        return res.status(400).json({ error: 'Name already taken' });

      const hashedPassword = await  RegistrationService.hashPassword(password);

      const newUser = {
        full_name,
        password: hashedPassword,
        email,
      };

      const user = await RegistrationService.insertTeacherUser(
        req.app.get('db'),
        newUser
      );

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(RegistrationService.serializeTeacherUser(user));
    } catch(error) {
      next(error);
    }
  });

module.exports = registrationRouter;
