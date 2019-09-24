const express = require('express');
const path = require('path');
const subGoalService = require('./subGoal-service');
const {requireAuth} = require('../middleware/jwt-auth');

const subGoalRouter = express.Router();
const jsonBodyParser = express.json();

subGoalRouter
  .post('/:student_goal_id', requireAuth, jsonBodyParser, async(req, res, next) => {
    let { subgoal_title, subgoal_description } = req.body

    const { student_goal_id } = req.params

    if(!subgoal_title){
      return res.status(400).json({
        error: "Missing 'title' in request body"
      });
    }
    if(!subgoal_description){
      subgoal_description = null;
    }

    try {
      const isValidStudentGoal = await subGoalService.verifyStudentGoal(
        req.app.get('db'),
        student_goal_id
      );
  
      if(!isValidStudentGoal){
        return res.status(404).json({error: 'Student goal not found'})
      }

      const newSubGoal = {
        student_goal_id,
        subgoal_title,
        subgoal_description
      };
  
      const subGoal = await subGoalService.insertSubGoal(
        req.app.get('db'),
        newSubGoal
      );
  
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${subGoal.id}`))
        .json({subGoal});
    }

    catch(error){
      next(error)
    }
  });

subGoalRouter
  .route('/subgoal/:subgoal_id')
  .delete((req, res, next) => {
    const { subgoal_id } = req.params;
    GoalsService.deleteGoal(
      req.app.get('db'),
      subgoal_id
    )
      .then(() => res.status(204).end())
      .catch(next);
    })
  .patch(jsonBodyParser, async (req, res, next) => {
    const { subgoal_id } = req.params;
    const { subgoal_title, subgoal_description, iscomplete, date_created } = req.body;
    const updateSubGoal = { subgoal_title, subgoal_description, iscomplete, date_created };
    const numberOfValues = Object.values(updateGoal).filter(Boolean).length;
      if(numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: 'Request body must contain information fields'
          }
        });
      }
      subGoalService.updateSubGoal(
        req.app.get('db'),
        subgoal_id,
        updateSubGoal
      )
        .then(updated => {
          res.status(204).end();
        })
        .catch(next);
  });

module.exports = subGoalRouter;