const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Data Endpoints', function (){
  let db;
  const testUsers = helpers.makeUsersArray();
  const testClass = helpers.makeClass(testUsers);
  const testGoals = helpers.makeGoals();
  const testSubgoals = helpers.makeSubGoals();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/data', () => {
    context('Given no data', () => {
      this.beforeEach(() =>
        helpers.seedUsers(db, testUsers));  
      it('responds with 404', () => {  
        return supertest(app)
          .get('/api/data')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404);
      });
    });
  });
  describe('GET /api/data/:classId', () => {
    it('responds with 200', () => { 
      const classId = testClass[0].id;
      return supertest(app)
        .get(`/api/data/${classId}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200);
    });
  });
  describe('GET /api/data/:classId/:goalId/:studentGoalId', () => {
    it('responds with 200 and data', () => {
      const classId = testClass[0].id;
      const goalId = testGoals[0].id;
      const studentGoalId = testSubgoals[0].student_goal_id;
      return supertest(app)
        .get(`/api/data/${classId}/${goalId}/${studentGoalId}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .expect((res => {
          expect(res.body).to.have.property('studentSubgoals');
        }));
    });
  });
});
