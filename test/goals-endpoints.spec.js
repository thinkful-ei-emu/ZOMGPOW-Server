const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Class Endpoints', function (){
  let db;
  const testUsers = helpers.makeUsersArray();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));
 
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/goals', () => {
    it('responds with 404', () => {  
      return supertest(app)
        .get('/api/goals')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(404);
    });
  }); 
  describe('GET /api/goals/class/:class_id', () => {
    const class_id = 1234;
    it('responds with 201', () => {  
      return supertest(app)
        .get(`/api/goals/class/${class_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201);
    });
  }); 
  describe('GET /api/goals/student/:student_id', () => {
    const student_id = 1234;
    it('responds with 201', () => {  
      return supertest(app)
        .get(`/api/goals/student/${student_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201);
    });
  }); 
}); 