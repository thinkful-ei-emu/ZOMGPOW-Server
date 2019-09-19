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
};

module.exports = subGoalService;