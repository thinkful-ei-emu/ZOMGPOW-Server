const express = require('express');
const path = require('path');
const subGoalService = require('./subGoal-service');
const {requireAuth} = require('../middleware/jwt-auth');

const subGoalRouter = express.Router();
const jsonBodyParser = express.json();

subGoalRouter
  .post('/:student_goal_id', requireAuth, jsonBodyParser, async(req, res, next) => {
    const { goal_title, goal_description } = req.body

    const { student_goal_id } = req.params

    if(!goal_title){
      return res.status(400).json({
        error: "Missing 'title' in request body"
      });
    }
    if(!goal_description){
      goal_description = null;
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
        goal_title,
        goal_description
      };
  
      const subGoal = await subGoalService.insertSubGoal(
        req.app.get('db'),
        newSubGoal
      );
  
      res
        .status(201)
        .json({subGoal});
    }

    catch(error){
      next(error)
    }
  });

module.exports = subGoalRouter;