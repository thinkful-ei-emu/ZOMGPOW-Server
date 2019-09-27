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

  describe('GET /api/class', () => {
    context('Given no class', () => {
      this.beforeEach(() =>
        helpers.seedUsers(db, testUsers));  

      it('responds with 200', () => {  
        return supertest(app)
          .get('/api/class')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200);
      });
    });
  });
  describe('GET /api/class/:class_id', () => {
    it('responds with 200', () => {
      const classId = 12345;  
      return supertest(app)
        .get(`/api/class/${classId}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200);
    });
  }); 
  describe('GET /api/class/:class_id/students', () => {
    it('responds with 201', () => { 
      const classId = 12345;   
      return supertest(app)
        .get(`/api/class/${classId}/students`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201);
    });
  }); 
});
