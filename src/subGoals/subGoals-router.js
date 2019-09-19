const express = require('express');
const path = require('path');
const subGoalService = require('./subGoal-service');

const subGoalRouter = express.Router();
const jsonBodyParser = express.json();

subGoalRouter
  .post('/', jsonBodyParser, async(req, res, next) => {
    const { goal_title } = req.body
    if(!goal_title){
      return res.status(400).json({
        error: "Missing 'title' in request body"
      });
    }

    const newSubGoal = {
      goal_title,
    };

    const subGoal = await subGoalService.insertSubGoal(
      req.app.get('db'),
      subGoal
    );

    res
      .status(201)
      .json(subGoal);

  });

module.exports = subGoalRouter;