const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  });
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user(teacher) objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      full_name: 'test-user-1',
      email: 'Testuser1@email.com',
      password: 'password',
    },
    {
      id: 2,
      full_name: 'test-user-2',
      email: 'Testuser2@email.com',
      password: 'password',
    },
  ];
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeStudentsArray(classes) {
  return [
    {
      id: 1,
      user_name: 'student-1',
      full_name: 'test-student-1',
      class_id: classes[0].id,
    },
    {
      id: 2,
      user_name: 'student-2',
      full_name: 'test-student-2',
      class_id: classes[0].id,
    },
  ];
}
/**
 * generate fixtures of class for a given user
 * @param {object} user - contains `id` property
 * @returns {Array(classes)} - arrays of classes
 */
function makeClass(teachers) {
  const classes = [
    {
      id: 1,
      class_title: 'Test class 1',
      classcode: '1234',
      teacher_id: teachers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];

  return classes;
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of goals objects
 */
function makeGoals() {
  return [
    {
      id: 1,
      class_id: 1,
      goal_title: 'Test Goal 1',
      goal_description: 'Test Goal Description 1',
      exit_ticket_type: 'multiple choice',
      exit_ticket_question: 'Test question 1?',
      exit_ticket_options: ['1', '2', '3', '4'],
      exit_ticket_correct_answer: 'B'
    },
    {
      id: 2,
      class_id: 1,
      goal_title: 'Test Goal 2',
      goal_description: 'Test Goal Description 2',
      exit_ticket_type: 'short answer',
      exit_ticket_question: 'Test question 2?',
      exit_ticket_options: null,
      exit_ticket_correct_answer: null
    }
  ]
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of subgoals objects
 */
function makeSubGoals() {
  return [
    {
      id: 1,
      student_goal_id: 1,
      subgoal_title: 'title 1',
      subgoal_description: 'description 1',
    },
    {
      id: 2,
      student_goal_id: 2,
      subgoal_title: 'title 2',
      subgoal_description: 'description 2',
    }
  ]
}

function makeStudentGoals(class_id, student, goal) {
  return[
    {
      id: 1,
      class_id: class_id[0].id,
      student_id: student[0].id,
      goal_id: goal[0].id,
      iscomplete: false,
      evaluation: 2,
      student_response: 'A',
    },
    {
      id: 2,
      class_id: class_id[0].id,
      student_id: student[1].id,
      goal_id: goal[0].id,
      iscomplete: false,
      evaluation: 1,
      student_response: 'C',
    }
  ]
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `email`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  });
  return `bearer ${token}`;
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "teachers",
        "classes",
        "students",
        "goals",
        "student_goals",
        "subgoals"`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE teachers_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE classes_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE students_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE goals_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE student_goals_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE subgoals_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('teachers_id_seq', 0)`),
          trx.raw(`SELECT setval('classes_id_seq', 0)`),
          trx.raw(`SELECT setval('students_id_seq', 0)`),
          trx.raw(`SELECT setval('goals_id_seq', 0)`),
          trx.raw(`SELECT setval('student_goals_id_seq', 0)`),
          trx.raw(`SELECT setval('subgoals_id_seq', 0)`),
        ])
      )
  )
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('teachers').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('teachers_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  })
}

function seedStudents(db, students){
  return db.transaction(async trx => {
    await trx.into('students').insert(students)
    await trx.raw(
      `SELECT setval('students_id_seq', ?)`,
      [students[students.length - 1].id],
    )
  })
}

function seedClass(db, classes){
  return db.transaction(async trx => {
    await trx.into('classes').insert(classes)
    await trx.raw(
      `SELECT setval('classes_id_seq', ?)`,
      [classes[classes.length - 1].id], 
    ) 
  })
}
function seedGoals(db, goals) {
  return db.transaction(async trx => {
    await trx.into('goals').insert(goals)
    await trx.raw(
      `SELECT setval('goals_id_seq', ?)`,
      [goals[goals.length - 1].id],
    )
  })
}

function seedSubGoals(db, subgoals) {
  return db.transaction(async trx => {
    await trx.into('subgoals').insert(subgoals)
    await trx.raw(
      `SELECT setval('subgoals_id_seq', ?)`, 
      [subgoals[subgoals.length - 1].id],
    )
  })
}

function seedStudentGoals(db, student_goals) {
  return db.transaction(async trx => {
    await trx.into('student_goals').insert(student_goals)
    await trx.raw(
      `SELECT setval('student_goals_id_seq', ?)`, 
      [student_goals[student_goals.length - 1].id],
    )
  })
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeStudentsArray,
  makeClass,
  makeStudentGoals,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedStudents,
  makeGoals,
  seedGoals,
  makeSubGoals,
  seedSubGoals, 
  seedClass,
  seedStudentGoals,
}
