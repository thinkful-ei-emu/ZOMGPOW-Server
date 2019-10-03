const express = require('express');
const studentService = require('./studentGoal-service');
const studentGoalRouter = express.Router();
const jsonParser = express.json();

studentGoalRouter
  .route('/student/:student_id')
  .get(async (req, res, next) => {
    try{
      const {student_id} = req.params;
      const student = await studentService.getStudent(req.app.get('db'), student_id);
      res.status(201).json({student});
    }
    catch(e){
      next(e);
    }
  });

studentGoalRouter
  .route('/student/:student_id/:student_goal_id')
  .get(async (req, res, next) => {
    try{
      const {student_id, student_goal_id } = req.params;
      const studentGoal = await studentService.getStudentGoal(req.app.get('db'), student_id, student_goal_id);
      if(studentGoal === undefined)
        return res.status(401).json({ error: 'Student Goal Doesn\'t exist' });
      res.status(201).json({studentGoal});
    }
    catch(e){
      next(e);
    }
  });

studentGoalRouter
  .route('/learning_target/:student_goal_id')
  .patch(jsonParser, async (req, res, next) => {
    try{
      const { student_goal_id } = req.params;
      const { iscomplete, evaluation, student_response } = req.body;
      const updatedLearningTarget = { iscomplete, evaluation, student_response };
      const numberOfValues = Object.values(updatedLearningTarget).filter(Boolean).length;
      if(numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: 'Request body must contain information fields'
          }
        });
      }
      let patchGoal = await studentService.updateLearningTarget(
        req.app.get('db'),
        student_goal_id,
        updatedLearningTarget
      );
      req.app.get('io').emit('patch student goal', (patchGoal));
      res.status(204).end();
    }
    catch(error) {
      next(error);
    }
  });

studentGoalRouter
  .route('/subgoal/:id')
  .patch(jsonParser, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { subgoal_title, subgoal_description, iscomplete, date_created, evaluation } = req.body;
      const updatedSubGoal= { subgoal_title, subgoal_description, iscomplete, date_created, evaluation };
      const numberOfValues = Object.values(updatedSubGoal).filter(Boolean).length;
      if(numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: 'Request body must contain information fields'
          }
        });
      }
      let patchSubgoal = await studentService.updateSubGoal(
        req.app.get('db'),
        id,
        updatedSubGoal
      );
      req.app.get('io').emit('patch subgoal', (patchSubgoal));
      res.status(204).end();
    }
    catch(error) {
      next(error);
    }
  });

module.exports = studentGoalRouter;