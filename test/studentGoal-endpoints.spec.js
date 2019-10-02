const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Student Goal Endpoints', function(){
  let db; 
  const testUsers = helpers.makeUsersArray();
  const testClass = helpers.makeClass(testUsers);
  const testStudents = helpers.makeStudentsArray(testClass);
  const testGoals = helpers.makeGoals();
  const testSubgoals = helpers.makeSubGoals();
  const testStudentGoals = helpers.makeStudentGoals(testClass, testStudents, testGoals);

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect form db', () => db.destroy());
  before('cleanup', () =>  helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert users',() =>
    helpers.seedUsers(
      db,
      testUsers,
    )
  ); 
  beforeEach('insert classes',() =>  
    helpers.seedClass(
      db,
      testClass,
    )
  );
  beforeEach('insert students', () =>
    helpers.seedStudents(
      db,
      testStudents,
    )
  );

  describe('GET /api/studentgoals/student/:student_id', () => {
    const student_id = testStudents[0].id;
    it('respondes with 201 and student info', () => {
      return supertest(app)
        .get(`/api/studentgoals/student/${student_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect((res => {
          expect(res.body.student).to.have.property('id');
          expect(res.body.student.user_name).to.eql(testStudents[0].user_name);
          expect(res.body.student.full_name).to.eql(testStudents[0].full_name);
          expect(res.body.student.class_id).to.eql(testStudents[0].class_id);
          expect(res.body.student).to.have.property('date_created');
          expect(res.body.student).to.have.property('date_modified');
        }));
    });
  });
  describe('GET /api/studentgoals/student/:student_id/:student_goal_id', () => {
    beforeEach('insert goals', () =>
      helpers.seedGoals(
        db,
        testGoals,
      )
    );
    beforeEach('insert student_goals', () => 
      helpers.seedStudentGoals(
        db,
        testStudentGoals
      )
    );
    const student_id = testStudents[0].id;
    const student_goal_id = testStudentGoals[0].id;
    it('responds with 201 and student goal info', () => {
      return supertest(app)
        .get(`/api/studentgoals/student/${student_id}/${student_goal_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect((res => {
          expect(res.body.studentGoal.class_id).to.eql(testStudentGoals[0].class_id);
          expect(res.body.studentGoal.student_id).to.eql(testStudentGoals[0].student_id);
          expect(res.body.studentGoal.goal_id).to.eql(testStudentGoals[0].goal_id);
          expect(res.body.studentGoal.iscomplete).to.eql(testStudentGoals[0].iscomplete);
          expect(res.body.studentGoal.evaluation).to.eql(testStudentGoals[0].evaluation);
          expect(res.body.studentGoal.student_response).to.eql(testStudentGoals[0].student_response);
        }));
    });
  });
  describe('PATCH /api/studentgoals/learning_target/:student_goal_id', () => {
    beforeEach('insert goals', () =>
      helpers.seedGoals(
        db,
        testGoals,
      )
    );
    beforeEach('insert student_goals', () => 
      helpers.seedStudentGoals(
        db,
        testStudentGoals
      )
    );
    it('should respond with 204', () => {
    const student_goal_id = testStudentGoals[0].id;
    const updated_goal = {
      id: 1,
      class_id: 1,
      goal_title: 'Test Goal 1',
      goal_description: 'Test Goal Description 1',
      exit_ticket_type: 'multiple choice',
      exit_ticket_question: 'Test question 1?',
      exit_ticket_options: ['1', '2', '3', '4'],
      exit_ticket_correct_answer: 'B',
      iscomplete: 'true',
      evaluation: 1,
      student_response: 'A'
    };
    const expected_goal = {
      ...testGoals[student_goal_id-1],
      ...updated_goal
    };
    return supertest(app)
      .patch(`/api/studentgoals/learning_target/${student_goal_id}`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .send(updated_goal)
      .expect(204)
      .expect((res => {
        console.log('studentgoal', res.body)
      }));
    });
  });
  describe('PATCH /api/studentgoals/subgoal/:id', () => {
    beforeEach('insert goals', () =>
      helpers.seedGoals(
        db,
        testGoals,
      )
    );
    beforeEach('insert student_goals', () => 
      helpers.seedStudentGoals(
        db,
        testStudentGoals
      )
    );
    beforeEach('insert subgoals', () => 
      helpers.seedSubGoals(
        db,
        testSubgoals
      )
    );
    it('should respond with 204', () => {
    const id = testSubgoals[0].id;
    const updated_subgoal = {
      id: 1,
      student_goal_id: 1,
      subgoal_title: 'title 1',
      subgoal_description: 'description 1',
      iscomplete: 'true',
      evaluation: 1,
      student_response: 'A'
    };
    const expected_subgoal = {
      ...testSubgoals[id-1],
      ...updated_subgoal
    };
    return supertest(app)
      .patch(`/api/studentgoals/learning_target/${id}`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .send(updated_subgoal)
      .expect(204)
      .expect((res => {
        console.log('studentgoal', res.body)
      }));
    });
  });
});