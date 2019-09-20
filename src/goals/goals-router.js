const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const GoalsService = require('./goals-service');
const SubgoalService = require('../subGoals/subGoal-service');
const goalsRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

goalsRouter
  .all(requireAuth)

goalsRouter
  .route('/class/:class_id')
  .get(async (req, res, next) => {
    try {
    const { class_id } = req.params;
    const goals = await GoalsService.getAllClassGoals(req.app.get('db'), class_id)
    console.log(goals);
    const subgoals = await SubgoalService.getClassSubGoals(req.app.get('db'), class_id)
    res.status(201).json({goals, subgoals});
    next();
    }
    catch(error) {
      next(error)
    }
  })
  .post(jsonParser, async (req, res, next) => {
    try{
    const { class_id } = req.params;
    const { goal_title, goal_description, deadline } = req.body;
    const newGoal = { class_id, goal_title, goal_description };
    for (const [key, value] of Object.entries(newGoal))
      if(value === null)
        return res.status(401).json({
          error: `Missing '${key}' in request body`
        });

    let goal = await GoalsService.insertGoal(req.app.get('db'), newGoal)
    await GoalsService.insertStudentGoals(req.app.get('db'), goal.id, class_id)
    res.status(201)
          .location(path.posix.join(req.originalUrl, `/${goal.id}`))
          .json(goal);
    next();
    }
    catch(error){
      next(error)
    }
  });

  goalsRouter
  .route('/student/:student_id')
  .get(async (req, res, next) => {
    try {
    const { student_id } = req.params;
    const goals = await GoalsService.getStudentGoals(req.app.get('db'), student_id)
    const subgoals = await SubgoalService.getStudentSubGoals(req.app.get('db'), student_id)
    res.status(201).json({goals, subgoals});
    next();
    }
    catch(error) {
      next(error)
    }
  })

goalsRouter
  .route('/goals/:goal_id')
  .delete((req, res, next) => {
    const { goal_id } = req.params;
    GoalsService.deleteGoal(
      req.app.get('db'),
      goal_id
    )
      .then(() => res.status(204).end())
      .catch(next);
  })
  .patch(jsonParser, async (req, res, next) => {
    const { goal_id } = req.params;
    const { goal_title, goal_description, deadline, date_created } = req.body;
    const updateGoal = { goal_title, goal_description, deadline, date_created };
    const numberOfValues = Object.values(updateGoal).filter(Boolean).length;
      if(numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: 'Request body must contain information fields'
          }
        });
      }
      GoalsService.updateGoal(
        req.app.get('db'),
        goal_id,
        updateGoal
      )
        .then(updated => {
          res.status(204).end();
        })
        .catch(next);
  });


module.exports = goalsRouter;