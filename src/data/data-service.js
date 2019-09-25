const config = require('../config');


const dataService = {
  //how long it took a class to get a session goal
  getTimeForGoal(db, class_id) {
    return db('goals')
      .select('id', 'goal_title', 'date_created', 'date_completed')
      .whereNotNull('date_completed')
      .andWhere({ class_id })
    // .where('class_id', class_id);

  },

  getStudents(db, class_id) {
    return db('students')
      .count('*')
      .where({class_id});
  }


};

module.exports = dataService;