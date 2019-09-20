const ClassService = {

  getClasses(knex, id) {
    return knex
      .from('classes')
      .select('*')
      .where(
        { 'teacher_id': id }
      );
  },
  getClassById(knex, teacher_id, class_id) {
    return knex
      .from('classes')
      .select('*')
      .where(
        { 'teacher_id': teacher_id, 'id': class_id }
      );
  },
  getStudentsByClassId(knex, id) {
    return knex
      .from('students')
      .leftJoin('student_goals', 'student_goals.student_id', 'students.id')
      .leftJoin('goals', 'goals.id', 'student_goals.goal_id')
      .leftJoin('subgoals', 'subgoals.student_goal_id', 'student_goals.id')
      .select(
        'students.full_name',
        'students.user_name',
        'goals.goal_title AS goal',
        'student_goals.iscomplete',
        'subgoals.goal_title As subgoal'
      )
      .where('students.class_id', id);
  },
  insertClass(knex, newClass) {
    return knex
      .insert(newClass)
      .into('classes')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  randomSix() {
    return Math.floor(Math.random() * Math.floor(999999));
  }
};

module.exports = ClassService;