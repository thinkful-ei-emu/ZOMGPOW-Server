const express = require('express');
const path = require('path');
const RegistrationService = require('./registration-service');

const registrationRouter = express.Router();
const jsonBodyParser = express.json();

registrationRouter
  .post('/teacher', jsonBodyParser, async (req, res, next) => {
    const { password, username, name, email } = req.body;

    for (const field of ['name', 'username', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    try {
      const passwordError = RegistrationService.validatePassword(password);

      if (passwordError)
        return res.status(400).json({ error: passwordError });

      const hasTeacherWithUserName = await RegistrationService.hasTeacherWithUserName(
        req.app.get('db'),
        username
      );

      if (hasTeacherWithUserName)
        return res.status(400).json({ error: 'Username already taken' });

      const hashedPassword = await  RegistrationService.hashPassword(password);

      const newUser = {
        username,
        password: hashedPassword,
        name,
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
