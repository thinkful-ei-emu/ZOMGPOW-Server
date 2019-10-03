const express = require('express');
const dataService = require('./data-service');
const { requireAuth } = require('../middleware/jwt-auth');
const dataRouter = express.Router();
// const jsonBodyParser = express.json();
// const path = require('path');


dataRouter
  .get('/:classId', requireAuth, async (req, res, next) => {
    const { classId } = req.params;
    if (classId === 123) {
      return res.status(400).json({ error: 'Need class id' });
    }
    try {
      const dates = await dataService.getTimeForGoal(req.app.get('db'), classId);
      const completed = await dataService.getCompleted(req.app.get('db'), classId);
      const totalStudents = await dataService.getTotalStudents(req.app.get('db'), classId);

      let time;
      let dataArr = [];
      //get date_created and date_completed timestamps for each goal
      for (let i = 0; i < dates.length; i++) {
        //breakup timestamps into hours and minutes 
        let createdHours = Number(dates[i]['date_created'].getHours());
        let completedHours = Number(dates[i]['date_completed'].getHours());
        let createdMins = Number(dates[i]['date_created'].getMinutes());
        let completedMins = Number(dates[i]['date_completed'].getMinutes());
        //convert both created and completed times to mins
        let totalCreatedMins = (createdHours * 60) + createdMins;
        let totalCompletedMins = (completedHours * 60) + completedMins;
        //find difference between the completed and created times in mins to calc how long it took to complete the goal
        let totalMins = totalCompletedMins - totalCreatedMins;
        //convert the time it took to complete the goal back into a string of hours and mins
        let hours = Math.floor(totalMins / 60).toString();
        let mins = (totalMins % 60).toString();
        if (hours < 10) {
          hours = `0${hours}`;
        }
        if (mins < 10) {
          mins = `0${mins}`;
        }
        time = `${hours}h ${mins}m`;
        dataArr.push({ id: dates[i]['id'], goal_title: dates[i]['goal_title'], time: time, });
      }

      //update dataArr to include total_completed property
      for (let i = 0; i < dataArr.length; i++) {
        //find the completed total for specfied goal by id and add the following properties to the dataArr
        let completedElement = completed.find(completed => completed.id === dataArr[i].id);
        if (completedElement) {
          dataArr[i]['total_completed'] = completedElement['completed'];
        }
        else {
          //if no students completed the learning target goal then set total to 0
          dataArr[i]['total_completed'] = 0;
        }
      }

      //update dataArr to include total_students, avg_completed, eval_total, eval_avg and eval_percent properties
      for (let i = 0; i < dataArr.length; i++) {
        //find the student total for specfied goal by id and add the following properties to the dataArr
        let totalStudentsElement = totalStudents.find(total => total.id === dataArr[i].id);
        if(totalStudentsElement){
          dataArr[i]['total_students'] = totalStudentsElement['total_students'];
          dataArr[i]['avg_completed'] = `${((Number(dataArr[i]['total_completed']) / Number(totalStudentsElement['total_students']) * 100)).toFixed(0)}%`;
          dataArr[i]['eval_total'] = totalStudentsElement['eval_total'];
          dataArr[i]['eval_avg'] = Number(totalStudentsElement['eval_avg']).toFixed(2);
          dataArr[i]['eval_percentage'] = `${(((Number(totalStudentsElement['eval_avg'])) / 3) * 100).toFixed(0)}%`;
        }
      }
      res.status(200).json({ dataArr });
    }
    catch (e) {
      next(e);
    }
  })
  .get('/:classId/:goalId', requireAuth, async (req, res, next) => {
    const { classId, goalId } = req.params;
    try {
      const studentResponses = await dataService.getStudentResponses(req.app.get('db'), classId, goalId);
      const exitTicketInfo = await dataService.getExitTicketInfo(req.app.get('db'), goalId);
      const correctResponse = await dataService.getCorrectResponse(req.app.get('db'), goalId, exitTicketInfo[0].answer);
      let correctPer = `${(Number(correctResponse[0].correct_response) / studentResponses.length * 100).toFixed(0)}%`;

      exitTicketInfo[0]['correct_res_total'] = correctResponse[0].correct_response;
      exitTicketInfo[0]['res_total'] = studentResponses.length;
      exitTicketInfo[0]['correct_res_avg'] = correctPer;
      res.status(200).json({ studentResponses, exitTicketInfo });
    }
    catch (e) {
      next(e);
    }
  })
  .get('/:classId/:goalId/:studentGoalId', requireAuth, async (req, res, next) => {
    const { studentGoalId } = req.params;

    try {
      const studentSubgoals = await dataService.getStudentSubgoals(req.app.get('db'), studentGoalId);
      res.status(200).json({ studentSubgoals });
    }
    catch (e) {
      next(e);
    }
  });

module.exports = dataRouter;