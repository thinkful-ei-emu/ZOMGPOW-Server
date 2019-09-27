const studentGoal ={
  updateSubGoal(db, id, newSubGoalEval){
    return db('subgoals')
      .where({ student_goal_id: id })
      .update(newSubGoalEval);
  },
  updateLearningTarget(db, id, newLearningTarget){
    return db('student_goals')
      .where({id: id})
      .update(newLearningTarget);
  }
};

module.exports = studentGoal;