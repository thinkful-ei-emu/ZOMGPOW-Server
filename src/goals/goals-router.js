const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const GoalsService = require('./goals-service');
const SubgoalService = require('../subGoals/subGoal-service');
const goalsRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

goalsRouter
  // .all(requireAuth)

goalsRouter
  .route('/class/:class_id')
  .get(async (req, res, next) => {
    try {
    const { class_id } = req.params;
    const goals = await GoalsService.getAllClassGoals(req.app.get('db'), class_id)
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
    const {
      goal_title, 
      goal_description, 
      deadline, 
      exit_ticket_type,
      exit_ticket_question,
      exit_ticket_options,
      exit_ticket_correct_answer
    } = req.body;
    const newGoal = {
      class_id, 
      goal_title, 
      goal_description,
      exit_ticket_type,
      exit_ticket_question,
      exit_ticket_options,
      exit_ticket_correct_answer
    };
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
    console.log(goals)
    res.status(201).json({goals, subgoals});
    next();
    }
    catch(error) {
      next(error)
    }
  })

goalsRouter
  .route('/student/goal/:id')
  .patch(jsonParser, async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    const { iscomplete } = req.body;
    const updateGoal = { iscomplete };
      if(iscomplete === undefined) {
        return res.status(400).json({
          error: {
            message: 'Request body must contain information fields'
          }
        });
      }
      GoalsService.updateStudentGoal(
        req.app.get('db'),
        id,
        updateGoal
      )
        .then(updated => {
          console.log(updated)
          res.status(204).send();
        })
        .catch(next);
  });

goalsRouter
  .route('/goal/:goal_id')
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
    const { goal_title, goal_description, deadline, date_completed } = req.body;
    const updateGoal = { goal_title, goal_description, deadline, date_completed };
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