const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Class Endpoints', function (){
  let db;
  const testUsers = helpers.makeUsersArray();
  const testClass = helpers.makeClass(testUsers);
  const testStudents = helpers.makeStudentsArray(testClass);

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach(() =>
    helpers.seedUsers(db, testUsers));  
  beforeEach(() =>
    helpers.seedClass(db, testClass));
  beforeEach(() => 
    helpers.seedStudents(db, testStudents));

  describe('GET /api/class', () => {
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
      const classId = testClass[0].id;  
      return supertest(app)
        .get(`/api/class/${classId}`)
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
  describe('GET /api/class/:class_id/students', () => {
    it('responds with 201', () => { 
      const classId = testClass[0].id;   
      return supertest(app)
        .get(`/api/class/${classId}/students`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect((res => {
          expect(res.body).to.have.property('students');
          expect(res.body.students).to.have.lengthOf(2);
          expect(res.body.students[0].id).to.eql(testStudents[0].id);
          expect(res.body.students[0].user_name).to.eql(testStudents[0].user_name);
          expect(res.body.students[0].full_name).to.eql(testStudents[0].full_name);
          expect(res.body.students[0].class_id).to.eql(testStudents[0].class_id);
          expect(res.body.students[0]).to.have.property('date_created');
        }));
    });
  });
  describe('GET /api/class/:class_id/class', () => {
    it('responds with 201 and info', () => {
      const classId = testClass[0].id;
      return supertest(app)
        .get(`/api/class/${classId}/class`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect((res => {
          expect(res.body).to.have.property('students');
          expect(res.body.students).to.have.lengthOf(2);
          expect(res.body.students[0].id).to.eql(testStudents[0].id);
          expect(res.body.students[0].user_name).to.eql(testStudents[0].user_name);
          expect(res.body.students[0].full_name).to.eql(testStudents[0].full_name);
          expect(res.body.students[0].class_id).to.eql(testStudents[0].class_id);
          expect(res.body.students[0]).to.have.property('date_created');
          expect(res.body).to.have.property('goals');
          expect(res.body).to.have.property('studentGoals');
          expect(res.body).to.have.property('subgoals');
        }));
    });
  });
  describe('POST /api/class', () => {
    it('should return 201, location and new class', () => {
      const newClass = {
        class_title: 'newClass', 
        classcode: 2,
        teacher_id: testUsers[0].id
      };
      return supertest(app)
        .post('/api/class')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newClass)
        .expect(201)
        .expect((res => {
          expect(res.headers.location).to.eql(`/api/class/${res.body.id}`);
          expect(res.body).to.have.property('id');
          expect(res.body.class_title).to.eql(newClass.class_title);
          expect(res.body).to.have.property('classcode');
          expect(res.body).to.have.property('date_created');
          expect(res.body).to.have.property('date_modified');
          expect(res.body.teacher_id).to.eql(newClass.teacher_id);
        }));
    });
  });
  describe('DELETE /api/class/:class_id/students', () => {
    it('should respond wiht 204', () => {
      const class_id = testClass[0].id;
      const user_name = testStudents[0].user_name;
      return supertest(app)
        .delete(`/api/class/${class_id}/students`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send({user_name: user_name})
        .expect(204);
    });
  });
});
