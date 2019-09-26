const express = require('express');
const authRouter = express.Router();
const AuthService = require('./auth-service');
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

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

            return AuthService.getClassForTeacher(
              req.app.get('db'),
              user.id
            )
              .then(teachersClass => {
                const serializedUser = {
                  id: user.id,
                  full_name: user.full_name,
                  email: user.email,
                  date_created: user.date_created,
                  date_modified: user.date_modified
                };
                res.send({
                  user: serializedUser,
                  class: teachersClass,
                  authToken: AuthService.createJWT(sub, payload),
                })
              })
          })
      })
      .catch(next);   
  })
  .put('/teacher/login', requireAuth,jsonBodyParser,(req, res, next) => {
    const sub = req.user.email;
    const payload = {
      user_id: req.user.id,
      user_email: req.user.email,
    };
    res.send({
      authToken: AuthService.createJWT(sub, payload),
    });
  });

authRouter
  .post('/student/login', jsonBodyParser, async (req, res, next) => {
    const { user_name } = req.body;
    const loginStudent = user_name;
   
    if (!loginStudent) {
      return res.status(400).json({ error: `Missing user_name in request body` });
    }
    try {
      const student = await AuthService.getStudentWithUsername(req.app.get('db'), loginStudent)
        .then(user => {
          if (!user) {
            return res.status(400).json({ error: 'Incorrect username' });
          }   
        return user;
        
        });
      const sub = loginStudent;
      const payload = {
        id: student.id,
        user_name: student.user_name,
      };
      res.send({
        authToken: AuthService.createJWT(sub, payload),
      })
    } catch (error) {
      next(error)
    } 
  })    
module.exports = authRouter;