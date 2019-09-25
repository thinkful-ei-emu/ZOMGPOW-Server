const express = require('express');
const authRouter = express.Router();
const AuthService = require('./auth-service');
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

authRouter
  .post('/teacher/login', jsonBodyParser, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const loginUser = { email, password };
      for (const [key, value] of Object.entries(loginUser))
        if (value == null) {
          return res.status(400).json({ error: `Missing '${key}' in request body` });
        }

      let user = await AuthService.getUserWithEmail(req.app.get('db'), loginUser.email)
      if (!user) {
        return res.status(400).json({ error: 'Incorrect email or password' });
      }
      let match = await AuthService.comparePasswords(loginUser.password, user.password)
      if (!match) {
        return res.status(400).json({ error: 'Incorrect email or password' });
      }
      const sub = loginUser.email;
      const payload = { user_id: user.id };
      let teachersClass = await AuthService.getClassForTeacher(req.app.get('db'), user.id)
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
    }
    catch(error) {
      next(error)
    }
  })
  .put('/teacher/login', requireAuth,jsonBodyParser,(req, res, next) => {
    try{
      const sub = req.user.email;
      const payload = {
        user_id: req.user.id,
        user_email: req.user.email,
      };
      res.send({
        authToken: AuthService.createJWT(sub, payload),
      });
    }
    catch(error) {
      next(error)
    }
  });

authRouter
  .post('/student/login', jsonBodyParser, async (req, res, next) => {
    const { user_name } = req.body;
    console.log(user_name)
    const loginStudent = user_name;
   
    if (!loginStudent) {
      return res.status(400).json({ error: `Missing user_name in request body` });
    }
    try {
      const user = await AuthService.getStudentWithUsername(req.app.get('db'), loginStudent)
      if (!user) {
        return res.status(400).json({ error: 'Incorrect username' });
      }
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