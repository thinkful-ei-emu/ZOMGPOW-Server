const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Class Endpoints', function (){
  let db;
  const testUsers = helpers.makeUsersArray();
  const testClass = helpers.makeClass(testUsers);

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/class', () => {
    this.beforeEach(() =>
      helpers.seedUsers(db, testUsers));  
    this.beforeEach(() =>
      helpers.seedClass(db, testClass));  

    it('responds with 200', () => {  
      return supertest(app)
        .get('/api/class')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .expect((res => {
          expect(res.body[0].id).to.eql(testClass[0].id);
          expect(res.body[0].class_title).to.eql(testClass[0].class_title);
          expect(res.body[0]).to.have.property('classcode');
          expect(res.body[0].teacher_id).to.eql(testClass[0].teacher_id);
          expect(res.body[0]).to.have.property('date_created');
          expect(res.body[0]).to.have.property('date_modified');
        }));
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
