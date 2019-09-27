/* global supertest expect */
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Goals Endpoints', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testGoals = helpers.makeGoals();
  const [testGoal] = testGoals;
  const testSubGoals = helpers.makeSubGoals();
  const [subGoal] = testSubGoals;

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/goals/class/:class_id', () => {
    //get goals - class
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    beforeEach('insert goals', () => helpers.seedGoals(db, testGoals));
    beforeEach('insert subgoals', () => helpers.seedSubGoals(db, testSubGoals));

    it('responds 201 with goals and subgoals', () => {
      //insert goals and subgoals for test
      
      return supertest(app)
        .get('/api/goals/class/1')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200);
    });

    //post
  });

    

  describe('POST /api/goals/class/:class_id', () => {
    //post goals - class
  });

  describe('GET api/goals/student/:student_id', () => {
    //get student goals
  });

  describe('DELETE /api/goals/goal/:goal_id', () => {
    //delete goal
    //patch goal
  });
});