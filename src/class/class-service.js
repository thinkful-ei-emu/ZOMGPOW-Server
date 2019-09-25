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