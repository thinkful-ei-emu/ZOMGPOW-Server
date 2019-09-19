const express = require('express');
const xss = require('xss');
const classRouter = express.Router();
const bodyParser = express.json();
const ClassService = require('./class-service');
const { requireAuth } = require('../middleware/jwt-auth');


classRouter
  .route('/')
  .all(requireAuth)   
  .get((req, res, next) => {
    console.log(req.user)
    ClassService.getClasses(req.app.get('db'), req.user.id)
      .then(classes => {
        console.log(classes);
        return res.json(classes);
      })
      .catch(next); 
  });

module.exports = classRouter;