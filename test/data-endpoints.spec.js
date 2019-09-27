const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Data Endpoints', function (){
  let db;
  const testUsers = helpers.makeUsersArray();

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
    it('responds with 404', () => {  
      return supertest(app)
        .get('/api/data')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(404);
    });
    
  });
});
