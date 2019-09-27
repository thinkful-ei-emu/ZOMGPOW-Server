const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  /**
   * @description Get token for login
   **/
  describe('POST /api/auth/teacher/login', () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    );

    const requiredFields = ['email', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        email: testUser.email,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/teacher/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it('responds 400 \'invalid email or password\' when bad email', () => {
      const userInvalidUser = { email: 'user-not', password: 'existy' };
      return supertest(app)
        .post('/api/auth/teacher/login')
        .send(userInvalidUser)
        .expect(400, { error: 'Incorrect email or password' });
    });

    it('responds 400 \'invalid username or password\' when bad password', () => {
      const userInvalidPass = { email: testUser.email, password: 'incorrect' };
      return supertest(app)
        .post('/api/auth/teacher/login')
        .send(userInvalidPass)
        .expect(400, { error: 'Incorrect email or password' });
    });

    it('responds 200 and JWT auth token using secret when valid credentials', () => {
      const userValidCreds = {
        email: testUser.email,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id, name: testUser.name },
        process.env.JWT_SECRET,
        {
          subject: testUser.email,
          //expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      );
      return supertest(app)
        .post('/api/auth/teacher/login')
        .send(userValidCreds)
        .expect(200)
        .expect(res => {
          expect(res.body.user).to.have.property('id');
          expect(res.body.user.email).to.eql(testUser.email);
          expect(res.body.user.full_name).to.eql(testUser.full_name);
          expect(res.body.user.date_modified).to.eql(null);
          expect(res.body.user.authToken).to.eql(testUser.authToken);
        });
    });
  });

  /**
   * @description Refresh token
   **/
  describe('PATCH /api/auth/teacher/login', () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    );

    it('responds 200 and JWT auth token using secret', () => {
      const expectedToken = jwt.sign(
        { user_id: testUser.id, user_email: testUser.email },
        process.env.JWT_SECRET,
        {
          subject: testUser.email,
          //expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      );
      return supertest(app)
        .put('/api/auth/teacher/login')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, {
          authToken: expectedToken,
        });
        
    });
  });
});
