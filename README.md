
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

/api/auth/student/login

expects a username
sends back a username

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

POST /api/subgoals/:student_goal_id 
response:

DELETE /api/subgoals/subgoal/:subgoal_id
response: 204

PATCH /api/subgoals/subgoal/:subgoal_id
response: 204

GET /api/goals/class/:class_id
response:
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

POST /api/goals/class/:class_id
response:

GET /api/goals/student/:student_id
expects:
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

DELETE /api/goals/goal/:goal_id
expects: 204

PATCH /api/goals/goal/:goal_id
expects: 204


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.