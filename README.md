
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



## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.