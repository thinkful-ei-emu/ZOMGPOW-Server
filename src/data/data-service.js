const config = require('../config');


const dataService = {
  //how long it took a class to get a session goal
  getTimeForGoal(db, class_id){
    return db('goals')
      .select('date_created', 'date_completed')
      .whereNotNull('date_completed')
      .andWhere({class_id});
      
  },


};

module.exports = dataService;