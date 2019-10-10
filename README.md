# Sprout
Live Link: [Sprout App](https://sprout-app.now.sh/)

GitHub Repo: [Sprout Client](https://github.com/thinkful-ei-emu/ZOMGPOW-Client)

## Developers:
```Ashley Oelbaum, Christopher Martin, Martha Plantz, Nicholas Gunter, Whitney Wallace, Mantong Zhao```

## What is Sprout?
Sprout is a formative assessment tool used to help teachers deliver specific, goal-oriented, and timely feedback in the classroom.

### Demo Account:
See what Sprout has to offer by using these login credentials:

#### *`Email: Teacher@email.com`*
#### *`Password: Password1!`*

## Screenshots
### Teacher Dashboard:
<img src="src/Images/TeacherDashboard.png">

### Create an exit ticket before starting a session:
<img src="src/Images/ExitTicketModal.png">

### Goal Session in use:
<img src="src/Images/SproutInAction2.png">

### Teacher View of real-time Exit Ticket responses:
<img src="src/Images/ExitTicket.png">

### Teacher View of students ready for a check-in:
<img src="src/Images/Priority.png">

### Student Dashboard View of learning target and personalized goal:
<img src="src/Images/StudentDashboard.png">

### Student Self-Evaluation:
<img src="src/Images/StudentEval.png">

### Data Views:
<img src="src/Images/DataView.png">

<img src="src/Images/DataView2.png">`

## What's to come in Sprout:
1. Tooltips for dataview
2. Allow parents to create an account
3. Present student/class data for parents
4. Allow teachers to have multiple classes
5. Teachers can reset forgotten passwords
6. Calendar functionality 

### Set up
- Clone the repo both client and server: 
[Sprout client](https://github.com/thinkful-ei-emu/ZOMGPOW-Client)
[Sprout Server](https://github.com/thinkful-ei-emu/ZOMGPOW-Server)
- Start the application `npm start`
- Start nodemon for the application `npm run dev`
- Run the tests `npm test`

### Deploy
When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

### Tech Stack - Frontend 
- JavaScript
- React
- HTML5
- CSS

### Tech Stack - Backend
- Node.js
- PostgreSQL

### Libraries
- Socket.io
- Express
- Knex

### Testing - Frontend
- Jest

### Testing - Backend
- Mocha
- Chai
- Supertest

Endpoints
==========

#### 1. /api/register/teacher
- Expects request body containing: password, full_name, email
- Responds with: an object containing id, full_name, email

#### 2. /api/register/student
- Expects request body containing: full_name and class_id
- Responds with: an object containing id, full_name, user_name, and class_id

#### 3. /api/auth/teacher/login
- Expects request body containing: email and password
- Responds with: an email and an authToken

#### 4. /api/auth/student/login
- Expects request body containing: a username
- Responds with: a username

#### 5. GET /api/class
- Responds with:

[ 
  {  

    "id": 5,
    "class_title": "5th Grade",
    "classcode": 8321,
    "teacher_id": 5,
    "date_created": "2019-09-19T18:05:03.608Z",
    "date_modified": null
  },
  {

    "id": 6,
    "class_title": "math",
    "classcode": 148447,
    "teacher_id": 5,
    "date_created": "2019-09-19T21:58:33.883Z",
    "date_modified": null
  },
]

#### 6. POST /api/class
- Expects request body containing: a class_title

#### 7. GET /api/class/:classId/students
- Responds with:

[    {

        "full_name": "Student a",
        "user_name": "sa",
        "goal": "write a story about the favorite thing you did during the summer",
        "iscomplete": false,
        "subgoal": "brainstorm 3 ideas"
    },
    {
        "full_name": "Student b",
        "user_name": "sb",
        "goal": "write a story about the favorite thing you did during the summer",
        "iscomplete": false,
        "subgoal": null
    },
    {
        "full_name": "Student c",
        "user_name": "sc",
        "goal": "write a story about the favorite thing you did during the summer",
        "iscomplete": false,
        "subgoal": null
    }
]

#### 8. POST /api/subgoals/:student_goal_id 

#### 9. DELETE /api/subgoals/subgoal/:subgoal_id
- Responds with: 204

#### 10. PATCH /api/subgoals/subgoal/:subgoal_id
- Responds with: 204

#### 11. GET /api/goals/class/:class_id
- Responds with:

{

    "goals": [

        {
            "id": 2,
            "class_id": 3,
            "goal_title": "write a paragraph about your summer",
            "goal_description": "write a story about the favorite thing you did during the summer",
            "date_created": "2019-09-20T16:59:08.641Z",
            "deadline": null,
            "date_completed": null
        }
    ],
    "subgoals": [
        {
            "id": 6,
            "student_goal_id": 6,
            "subgoal_title": "create an ideas list",
            "subgoal_description": "write down some fun things you remember doing during the summer",
            "date_created": "2019-09-20T16:59:08.641Z",
            "iscomplete": false,
            "class_id": 3,
            "student_id": 11,
            "goal_id": 1
        }
    ]
}

#### 12. POST /api/goals/class/:class_id

#### 13. GET /api/goals/student/:student_id
- Responds with:

{

    "goals": [

        {
            "id": 1,
            "class_id": 4,
            "goal_title": "write a paragraph about your summer",
            "goal_description": "write a story about the favorite thing you did during the summer",
            "date_created": "2019-09-18T21:28:17.067Z",
            "deadline": null,
            "date_completed": null,
            "student_id": 16,
            "goal_id": 1,
            "iscomplete": false
        }
    ],
    "subgoals": [
        {
            "id": 1,
            "student_goal_id": 1,
            "goal_title": "create an ideas list",
            "goal_description": "write down some fun things you remember doing during the summer",
            "date_created": "2019-09-18T21:28:17.067Z",
            "iscomplete": false,
            "class_id": 4,
            "student_id": 16,
            "goal_id": 1
        }
    ]
}

#### 14. DELETE /api/goals/goal/:goal_id
- Responds with: 204

#### 15. PATCH /api/goals/goal/:goal_id
- Responds with: 204

#### 16. PATCH /api/studentgoals/learning_target/:class_id/:student_id/:goal_id
- Responds with: 204

#### 17. PATCH /api/studentgoals/subgoal/:subgoal_id
- Responds with: 204
