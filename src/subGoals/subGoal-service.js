const subGoalService ={
  getAllSubGoals(knex){
    return knex
      .select('*')
      .from('subgoals');
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
      .where('student_goal_id', id)
      .first();
  }
};

module.exports = subGoalService;