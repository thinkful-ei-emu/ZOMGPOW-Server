const config = require('../config');


const dataService = {
  //how long it took a class to get a session goal
  getTimeForGoal(db, class_id) {
    return db('goals')
      .select('id', 'goal_title', 'date_created', 'date_completed')
      .whereNotNull('date_completed')
      .andWhere({ class_id });
 

  },

  getCompleted(db, class_id) {
    return db('student_goals')
      .select('goal_id As id')
      .groupBy('goal_id')
      .count('* As completed')
      .where({ 'class_id': class_id, 'iscomplete': true })

  },
  getTotalStudents(db, class_id) {
    return db('student_goals')
      .select('goal_id As id')
      .groupBy('goal_id')
      .count('* As total_students')
      .where({ 'class_id': class_id,});
  }


};

module.exports = dataService;