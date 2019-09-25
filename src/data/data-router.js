const express = require('express');
const path = require('path');
const dataService = require('./data-service');
const { requireAuth } = require('../middleware/jwt-auth');

const dataRouter = express.Router();
const jsonBodyParser = express.json();


dataRouter
  .get('/:classId', requireAuth, async (req, res, next) => {

    const { classId } = req.params

    if (!classId) {
      return res.status(400).json({ error: 'Need class id' })
    }

    try {

      const dates = await dataService.getTimeForGoal(req.app.get('db'), classId) 
      const completed = await dataService.getCompleted(req.app.get('db'), classId)
      const totalStudents = await dataService.getTotalStudents(req.app.get('db'), classId)     
      let time;     
      let dateArr = []
    
      for (let i = 0; i < dates.length; i++) {
        let createdHours = Number(dates[i]["date_created"].getHours())
        let completedHours = Number(dates[i]["date_completed"].getHours())
        let createdMins = Number(dates[i]["date_created"].getMinutes())
        let completedMins = Number(dates[i]["date_completed"].getMinutes())
        let totalCreatedMins = (createdHours * 60) + createdMins
        let totalCompletedMins = (completedHours * 60) + completedMins
        let totalMins = totalCompletedMins - totalCreatedMins
        let hours = Math.floor(totalMins / 60).toString();
        let mins = (totalMins % 60).toString()
        if (hours < 10) {
          hours = `0${hours}`
        }
        if (mins < 10) {
          mins = `0${mins}`
        }
        time = `${hours}h ${mins}m`
        dateArr.push({ id: dates[i]["id"], goal_title: dates[i]["goal_title"], time: time, })
      }

      for(let i=0; i<dateArr.length; i++){    
        for(let j=0; j<completed.length; j++){
          if(completed[j].id === dateArr[i].id){
            dateArr[i]["total_completed"] = completed[j]["completed"]
            dateArr[i]["total_students"] = totalStudents[j]["total_students"]
            dateArr[i]["avg_completed"] = `${Math.ceil(Number(completed[j]["completed"])/Number(totalStudents[j]["total_students"]) * 100)}%`
                    
          }
        }
      }  
      
      console.log(dateArr);

      res.status(200).json({ dateArr })
    }
    catch (e) {
      next(e)
    }
  })

module.exports = dataRouter