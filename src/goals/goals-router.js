const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const GoalsService = require('./goals-service');
const goalsRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

goalsRouter
  .route('/:class_id')
  // .all(requireAuth)
  .get((req, res, next) => {
    const { class_id } = req.params;
    GoalsService.getAllClassGoals(req.app.get('db'), class_id)
      .then(goals => {
        res.json(goals);
      })
      .catch(next);
  })
  .post(jsonParser, async (req, res, next) => {
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
  });

goalsRouter
  .route('/:class_id/:goal_id')
  // .all(requireAuth)
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