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
    return knex('students')
      .select('*')
      .where('students.class_id', id);
  },
  getStudentsAndResponseByClassId(knex, class_id, num_of_stu){
    return knex('students')
      .select(
        'students.id',
        'students.user_name',
        'students.full_name',
        'students.class_id',
        'students.date_created',
        'stu_Goals.id AS stu_goal_id',
        'goals.date_created AS goal_date_created',
        'goals.goal_title',
        'stu_Goals.goal_id',
        'stu_Goals.iscomplete',
        'stu_Goals.evaluation',
        'stu_Goals.student_response'
      )
      .orderBy('goals.date_created', 'desc')
      .leftJoin('student_goals AS stu_Goals', 'stu_Goals.student_id', 'students.id')
      .leftJoin('goals', 'goals.id', 'stu_Goals.goal_id')
      .where( 'students.class_id', class_id )
      .groupBy('stu_Goals.id', 'students.id', 'goals.id')
      .limit(num_of_stu);
  },
  deleteStudent(db, user_name){
    return db('students')
      .where({user_name})
      .del();
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