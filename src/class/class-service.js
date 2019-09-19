const ClassService = {

  getClasses(knex, id) {
    return knex
      .from('classes')
      .select('*')
      .where(
        { 'teacher_id': id }
      );
  },
  getByClassId(knex, id) {
    return knex
      .from('students')
      .leftJoin('student_goals', 'student_goals.student_id', 'students.id')
      .leftJoin('goals', 'goals.id', 'student_goals.goal_id')
      .leftJoin('subgoals', 'subgoals.student_goal_id', 'student_goals.id')
      .select(
        'students.full_name',
        'students.user_name',
        'goals.goal_description AS goal',
        'student_goals.iscomplete',
        'subgoals.goal_description As subgoal'
      )
      .where('students.class_id', id);
  },

};

module.exports = ClassService;