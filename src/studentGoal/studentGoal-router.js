const express = require('express');
const studentService = require('./studentGoal-service');
//add requireAuth
const studentGoalRouter = express.Router();
const jsonParser = express.json();

studentGoalRouter
  .route('/learning_target/:class_id/:student_id/:goal_id')
  .patch(jsonParser, async (req, res, next) => {
    const { class_id, student_id, goal_id } = req.params
    const { evaluation } = req.body;
    const updatedLearningTarget = { evaluation };
    if(evaluation === undefined){
      return res.status(400).json({
        error:{
          message: 'Request body must contain an evaluation score'
        }
      });
    }
    studentService.updateLearningTarget(
      req.app.get('db'),
      class_id,
      student_id,
      goal_id,
      updatedLearningTarget
    )
    .then(updated => {
      res.status(204).end();
    })
    .catch(next);
  });

studentGoalRouter
  .route('/subgoal/:subgoal_id')
  .patch(jsonParser, async (req, res, next) => {
    const { subgoal_id } = req.params;
    const { evaluation } = req.body;
    const updatedSubGoal= { evaluation }
    if(evaluation === undefined){
      return res.status(400).json({
        error:{
          message: 'Request body must contain an evaluation score'
        }
      });
    }
    studentService.updateSubGoal(
      req.app.get('db'),
      subgoal_id,
      updatedSubGoal
    )
    .then(updated => {
      res.status(204).end();
    })
    .catch(next);
  });

module.exports = studentGoalRouter;