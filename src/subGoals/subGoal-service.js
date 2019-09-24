const subGoalService ={
  getClassSubGoals(knex, class_id){
    return knex('subgoals')
      .select('*')
      .join('student_goals', 'student_goals.id', 'subgoals.student_goal_id')
      .where({ class_id })
      .groupBy('subgoals.id', 'student_goals.id');
  },
  getStudentSubGoals(knex, student_id){
    return knex('subgoals')
      .select('*')
      .join('student_goals', 'student_goals.id', 'subgoals.student_goal_id')
      .where({ student_id })
      .groupBy('subgoals.id', 'student_goals.id');
  },
  getGoalSubGoals(knex, goal_id){
    return knex('subgoals')
      .select('*')
      .where({ goal_id });
  },
  insertSubGoal(knex, newSubGoal){
    return knex
      .insert(newSubGoal)
      .into('subgoals')
      .returning('*')
      .then(([subGoal])=> subGoal);
  },
  verifyStudentGoal(db, id){
    return db('student_goals')
      .where({ id })
      .first();
  },
  deleteSubGoal(db, id) {
    return db('goals')
      .where({ id })
      .delete();
  },
  updateSubGoal(db, id, newSubGoalData) {
    return db('goals')
      .where({ id })
      .update(newSubGoalData);
  }
};

module.exports = subGoalService;