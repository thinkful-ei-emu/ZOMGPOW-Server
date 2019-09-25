const express = require('express');
const {requireAuth} = require('../middleware/jwt-auth');


const studentGoalRouter = express.Router();
const jsonBodyParser = express.json();

//update studnet_goal table change evaluation column for specific studnet and specific goal
//requires using the class_id and student_id 

//need to add eval column to student_goals table and subgoals table 

//sub_goals have a student_goal_id that connects a subgoal to a student and a learning target
//student_goals have 


studentGoalRouter
  .patch('/learning_target/:goal_id/:student_id', requireAuth, jsonBodyParser, async(req, res, next) => {
    let { evaluation } = req.body;

  });

studentGoalRouter
  .patch('/subgoal/:student_goal_id', requireAuth, jsonBodyParser, async(req, res, next) => {
    let { evaluation } = req.body;
  });

module.exports = studentGoalRouter;