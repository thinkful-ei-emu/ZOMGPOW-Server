const studentGoal ={
  getStudent(db, id){
    return db('students')
      .where({ id })
      .first();
  },
  getStudentGoal(db, student_id, id){
    return db('student_goals')
      .select('*')
      .where({ student_id, id })
      .first();
  },
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