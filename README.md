
Endpoints
==========

/api/register/teacher

expects a request body containing password, full_name, email
responds with an object containing id, full_name, email

/api/register/student

expects a request body containing full_name and class_id
responds with an object containing id, full_name, user_name, and class_id

/api/auth/teacher/login

expects an email and password
sends back an email and an authToken

GET /api/class
response sample:  
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

POST /api/class
expects: class_title

GET /api/class/:classId/students
response sample: 
[    
    {
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


GET /api/subgoals
response:

POST /api/subgoals/:student_goal_id 
response:

GET /api/goals
response:

POST /api/goals/:class_id/:goal_id
expects:


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.