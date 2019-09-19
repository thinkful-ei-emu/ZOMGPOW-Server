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

classRouter
  .route('/:class_id/students')
  .all(requireAuth)
  .all((req, res, next) => {
    const { class_id } = req.params;
    console.log('class_id in params', class_id)

    ClassService.getByClassId(req.app.get('db'), class_id)
      .then(singleClass => {
        if (!singleClass) {
          return res.status(404).json({
            error: { message: `Class not found` }
          });
        }
        console.log(res.singleClass)
        res.singleClass = singleClass;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    console.log('single class', res.singleClass);
    res.json(res.singleClass);
  });

module.exports = classRouter;