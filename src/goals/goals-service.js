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
  getStudentGoals(db, student_id) {
    return db('goals')
      .select(
        'goals.id',
        'goals.class_id',
        'goals.goal_title',
        'goals.goal_description',
        'goals.deadline',
        'goals.date_completed',
        'student_goals.id AS sg_id',
        'student_goals.student_id',
        'student_goals.iscomplete',
        'student_goals.evaluation'
      )
      .join('student_goals', 'student_goals.goal_id', 'goals.id')
      .where({ student_id })
      .groupBy('goals.id', 'student_goals.id');
  },
  getStudentGoalsTable(db, class_id) {
    return db('student_goals')
      .select('*')
      .where({ class_id })
  },
  insertGoal(db, newGoal){
    return db('goals')
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
  },
  getStudentIds(db, class_id) {
    return db('students')
      .select('id')
      .where({ class_id });
  },
  insertStudentGoal(db, class_id, goal_id, student_id){
    return db('student_goals')
      .insert({ class_id, student_id, goal_id })
      .returning('*')
      .then(res => res[0]);
  },
  async insertStudentGoals(db, goal_id, class_id){
    let stuArr = await this.getStudentIds(db, class_id);
    for(let i=0; i < stuArr.length; i++){
      this.insertStudentGoal(db, class_id, goal_id, stuArr[i].id)
    }
  }
};

module.exports = GoalsService;