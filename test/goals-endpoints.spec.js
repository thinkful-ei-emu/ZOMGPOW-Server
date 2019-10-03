const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Goals Endpoints', function (){
  let db;
  const testUsers = helpers.makeUsersArray();
  const testClass = helpers.makeClass(testUsers);
  const testStudents = helpers.makeStudentsArray(testClass);
  const testGoals = helpers.makeGoals();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
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
  describe('POST /api/goals/class/:class_id', () => {
    it('creates a new goal and responds with 201', () => {
      const class_id = testClass[0].id;
      const newGoal =helpers.makeGoals()[0];
      return supertest(app)
        .post(`/api/goals/class/${class_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newGoal)
        .expect(201)
        .expect((res => {
          expect(res.body.class_id).to.eql(class_id);
          expect(res.body).to.have.property('date_created');
          expect(res.headers.location).to.eql(`/api/goals/class/${class_id}/${res.body.id}`);
          expect(res.body.goal_title).to.eql(newGoal.goal_title);
          expect(res.body.goal_description).to.eql(newGoal.goal_description);
          expect(res.body.exit_ticket_type).to.eql(newGoal.exit_ticket_type);
          expect(res.body.exit_ticket_question).to.eql(newGoal.exit_ticket_question);
          expect(res.body.exit_ticket_options).to.eql(newGoal.exit_ticket_options);
          expect(res.body.exit_ticket_correct_answer).to.eql(newGoal.exit_ticket_correct_answer);
        }));
    });
  });
  describe('DELETE /api/goals/goal/:goal_id', ()=> {
    it('should respond with 204 and remove the goal', ()=> {
      const remove_goal_id = 2;
      return supertest(app)
        .delete(`/api/goals/goal/${remove_goal_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(204);
    });
  });
  describe('PATCH /api/goals/goal/:goal_id', ()=> {
    context('Given no goals', ()=> {
      it('should respond with 400 and error message', ()=>{
        const update_goal_id= 54321;
        return supertest(app)
          .patch(`/api/goals/goal/${update_goal_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(400, {
            error: {
              message: 'Request body must contain information fields'
            }
          });
      });
    });
    beforeEach('insert goals', ()=> 
      helpers.seedGoals(
        db,
        testGoals
      )
    );
    context('Given there are goals', () => {
      it('should respond with 204', () => {
        const update_goal_id = 2;
        const updated_goal={
          id: 2,
          class_id: 1,
          deadline: null,
          goal_title: 'Test Goal 2 update',
          goal_description: 'Test Goal Description 2 update',
          exit_ticket_type: 'short answer',
          exit_ticket_question: 'Test question 2? update',
          exit_ticket_options: null,
          exit_ticket_correct_answer: null
        }
        const expected_goal = {
          ...testGoals[update_goal_id-1],
          ...updated_goal
        }
        return supertest(app)
          .patch(`/api/goals/goal/${update_goal_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(updated_goal)
          .expect(204)
          .expect((res => {
            console.log('goals', res.body)
          }));
      })
    });
  });
}); 