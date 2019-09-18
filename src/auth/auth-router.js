const express = require('express');
const authRouter = express.Router();
const AuthService = require('./auth-service');
const jsonBodyParser = express.json();

authRouter
  .post('/teacher/login', jsonBodyParser, (req, res, next) => {
    const { email, password } = req.body;
    const loginUser = { email, password };

    for (const [key, value] of Object.entries(loginUser))
      if (value == null) {
        return res.status(400).json({ error: `Missing '${key}' in request body` });
      }

    AuthService.getUserWithEmail(req.app.get('db'), loginUser.email)
      .then(user => {
        if (!user) {
          return res.status(400).json({ error: 'Incorrect email or password' });
        }
        return AuthService.comparePasswords(loginUser.password, user.password)
          .then(match => {
            if (!match) {
              return res.status(400).json({ error: 'Incorrect email or password' });
            }
            const sub = loginUser.email;
            const payload = { user_id: user.id };
            res.send({
              email: user.email,
              authToken: AuthService.createJWT(sub, payload),
            });
          });
      })
      .catch(next);
  });





module.exports = authRouter;