const studentGoal ={
  updateSubGoal(db, id, newSubGoalEval){
    return db('subgoals')
      .where({ id })
      .update(newSubGoalEval);
  },
  updateLearningTarget(db, class_id, student_id, goal_id, newLearningTarget){
    return db('student_goals')
      .where({class_id: class_id}, {student_id: student_id}, {goal_id: goal_id})
      .update(newLearningTarget);
  }
};

module.exports = studentGoal;