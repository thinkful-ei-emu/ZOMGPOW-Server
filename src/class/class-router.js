const express = require('express');
const xss = require('xss');
const classRouter = express.Router();
const bodyParser = express.json();
const ClassService = require('./class-service');
const GoalsService = require('../goals/goals-service');
const SubgoalService = require('../subGoals/subGoal-service');
const { requireAuth } = require('../middleware/jwt-auth');


classRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ClassService.getClasses(req.app.get('db'), req.user.id)
      .then(classes => {
        return res.json(classes);
      })
      .catch(next);
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { class_title, classcode, teacher_id } = req.body;
    const newClass = { class_title, classcode, teacher_id };
    for (const [key, value] of Object.entries(newClass))
      if (value === null)
        return res.status(401).json({
          error: `Missing '${key}' in request body`
        });

    newClass.teacher_id = req.user.id;
    newClass.classcode = ClassService.randomSix();

    ClassService.insertClass(
      req.app.get('db'),
      newClass
    )
      .then(newClass => {
        res.status(201).location(`/api/class/${newClass.id}`).json(newClass);
      })
      .catch(next);

  });

classRouter
  .route('/:class_id')
  .all(requireAuth)
  .all((req, res, next) => {
    const { class_id } = req.params;

    ClassService.getClassById(req.app.get('db'), req.user.id, class_id)
      .then(singleClass => {
        if (!singleClass) {
          return res.status(404).json({
            error: { message: 'Class not found' }
          });
        }
        res.singleClass = singleClass;

        next();
      })
      .catch(next);

  })
  .get((req, res, next) => {
    res.json(res.singleClass);
  });

classRouter
  .route('/:class_id/students')
  // .all(requireAuth)
  .all((req, res, next) => {
    const { class_id } = req.params;
    ClassService.getStudentsByClassId(req.app.get('db'), class_id)
      .then(singleClass => {
        if (!singleClass) {
          return res.status(404).json({
            error: { message: 'Class not found' }
          });
        }
      
        res.singleClass = singleClass;

        next();
      })
      .catch(next);
  })
  .get(async (req, res, next) => {
    try {
      const { class_id } = req.params;
      const students = res.singleClass;
      const goals = await GoalsService.getAllClassGoals(req.app.get('db'), class_id)
      const subgoals = await SubgoalService.getClassSubGoals(req.app.get('db'), class_id)
      const studentGoals = await GoalsService.getStudentGoalsTable(req.app.get('db'), class_id);
      res.status(201).json({students, goals, studentGoals, subgoals});
      next();
      }
      catch(error) {
        next(error)
      }
  })
  .delete( bodyParser, (req, res, next) => {
      
      const {user_name} = req.body

      // accepts class_id but doens't utilize it, may need to upon refactor
      const {class_id} = req.params



      ClassService.deleteStudent(
        req.app.get('db'),
         user_name
         ).then(() => {
          res.status(204).send()
         })
         .catch(next)
  });
  

module.exports = classRouter;