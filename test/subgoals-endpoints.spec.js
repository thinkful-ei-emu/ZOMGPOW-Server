const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Subgoal Endpoints', function(){
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
  beforeEach('insert goals', () =>
    helpers.seedGoals(
      db,
      testGoals,
    )
  );
  beforeEach('insert studnet_goals', () => 
    helpers.seedStudentGoals(
      db,
      testStudentGoals
    )
  );
  describe('POST /api/subgoals/:student_goal_id', () => {
    it('creates a new subgoal and responds with 201', () => {
      const student_goal_id = 1;
      const newSubGoal = helpers.makeSubGoals()[0];
      return supertest(app)
        .post(`/api/subgoals/${student_goal_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newSubGoal)
        .expect(201)
        .expect((res => {
          expect(res.body.class_id).to.eql(newSubGoal.class_id);
          expect(res.body.student_id).to.eql(newSubGoal.student_id);
          expect(res.body.goal_id).to.eql(newSubGoal.goal_id);
          expect(res.body.iscomplete).to.eql(newSubGoal.iscomplete);
          expect(res.body.class_id).to.eql(newSubGoal.evaluation);
          expect(res.body.class_id).to.eql(newSubGoal.student_response);
        }));
    });
  });
  describe('DELETE /api/subgoals/subgoal/:subgoal_id', () => {
    beforeEach('insert student subgoals', () => 
      helpers.seedSubGoals(
        db,
        testSubgoals
      )
    );
    it('should delete subgoal and respond with 204', () => {
      const remove_subgoal_id = 1;
      return supertest(app)
        .delete(`/api/subgoals/subgoal/${remove_subgoal_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(204);
    });
  });
});