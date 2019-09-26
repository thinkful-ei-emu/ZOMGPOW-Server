const express = require('express');
const studentService = require('./studentGoal-service');
const studentGoalRouter = express.Router();
const jsonParser = express.json();

studentGoalRouter
  .route('/learning_target/:student_goal_id')
  .patch(jsonParser, async (req, res, next) => {
    try{
      const { student_goal_id } = req.params;
      const { iscomplete, evaluation } = req.body;
      const updatedLearningTarget = { iscomplete, evaluation };
      const numberOfValues = Object.values(updatedLearningTarget).filter(Boolean).length;
      if(numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: 'Request body must contain information fields'
          }
        });
      }
      await studentService.updateLearningTarget(
        req.app.get('db'),
        student_goal_id,
        updatedLearningTarget
      );
      res.status(204).end();
    }
    catch(error) {
      next(error);
    }
  });

studentGoalRouter
  .route('/subgoal/:subgoal_id')
  .patch(jsonParser, async (req, res, next) => {
    try {
      const { subgoal_id } = req.params;
      const { evaluation } = req.body;
      const updatedSubGoal= { evaluation };
      if(evaluation === undefined){
        return res.status(400).json({
          error:{
            message: 'Request body must contain an evaluation score'
          }
        });
      }
      await studentService.updateSubGoal(
        req.app.get('db'),
        subgoal_id,
        updatedSubGoal
      );
      res.status(204).end();
    }
    catch(error) {
      next(error);
    }
  });

module.exports = studentGoalRouter;