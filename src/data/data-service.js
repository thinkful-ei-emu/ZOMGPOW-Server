const config = require('../config');


const dataService = {
  //how long it took a class to get a session goal
  getTimeForGoal(db, class_id) {
    return db('goals')
      .select('id',
        'goal_title',
        'date_created',
        'date_completed'
      )
      .whereNotNull('date_completed')
      .andWhere({ class_id });
  },
  getExitTicketInfo(db, id) {
    return db('goals')
      .select(
        'exit_ticket_type As question_type',
        'exit_ticket_question As question',
        'exit_ticket_options As options',
        'exit_ticket_correct_answer As answer')
      .where( {id});
  },

  getCompleted(db, class_id) {
    return db('student_goals')
      .select('goal_id As id')
      .groupBy('goal_id')
      .count('* As completed')
      .where({ 'class_id': class_id, 'iscomplete': true });

  },
  getCorrectResponse(db, goal_id, answer) {
    return db('student_goals')         
      .count('* As correct_response')
      .where({ 'goal_id': goal_id, 'student_response': answer });
  },

  getTotalStudents(db, class_id) {
    return db('student_goals')
      .select('goal_id As id')
      .groupBy('goal_id')
      .count('* As total_students')
      .sum('evaluation As eval_total')
      .avg('evaluation As eval_avg')
      .where({ 'class_id': class_id, });
  },
  getStudentResponses(db, class_id, goal_id) {
    return db('students')
      .leftJoin('student_goals', 'student_goals.student_id', 'students.id')
      .leftJoin('goals', 'goals.id', 'student_goals.goal_id')
      .select('student_goals.goal_id As goal_id',
        'student_goals.id As student_goal_id',
        'students.full_name As full_name',
        'goals.goal_title As title',
        'student_goals.iscomplete As complete',
        'student_goals.evaluation As eval_score',
        'student_goals.student_response As response')
      .where({ 'student_goals.class_id': class_id, 'student_goals.goal_id': goal_id })
  },
  getStudentSubgoals(db, student_goal_id) {
    return db('students')
      .leftJoin('student_goals', 'student_goals.student_id', 'students.id')
      .leftJoin('subgoals', 'subgoals.student_goal_id', 'student_goals.id')
      .select('subgoals.id As id',
        'students.full_name As full_name',
        'subgoals.student_goal_id',
        'subgoals.subgoal_title As title',
        'subgoals.subgoal_description As description',
        'subgoals.iscomplete As complete',
        'subgoals.evaluation As eval_score')
      .where({ student_goal_id })
  }





};

module.exports = dataService;