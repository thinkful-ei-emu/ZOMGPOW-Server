const studentGoal ={
  updateSubGoal(db, id, newSubGoalEval){
    return db('subgoals')
      .where({ id })
      .update(newSubGoalEval);
  },
  updateLearningTarget(db, student_goal_id, newLearningTarget){
    return db('student_goals')
      .where({id: student_goal_id})
      .update(newLearningTarget);
  }
};

module.exports = studentGoal;