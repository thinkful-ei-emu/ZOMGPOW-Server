const xss = require('xss');

const GoalsService = {
  getAllClassGoals(db, class_id) {
    return db('goals')
      .select(
        'id',
        'class_id',
        'goal_title',
        'goal_description',
        'date_created',
        'deadline',
        'date_completed'
      )
      .where({ class_id });
  },
  insertGoal(db, newGoal){
    return db('gaols')
      .insert(newGoal)
      .returning('*')
      .then(res => res[0]);
  },
  deleteGoal(db, id) {
    return db('goals')
      .where({ id })
      .delete();
  },
  updateGoal(db, id, newGoalData) {
    return db('goals')
      .where({ id })
      .update(newGoalData);
  }
};

module.exports = GoalsService;