const express = require('express');
const path = require('path');
const dataService = require('./data-service');
const {requireAuth} = require('../middleware/jwt-auth');

const dataRouter = express.Router();
const jsonBodyParser = express.json();


dataRouter
  .get('/:classId', requireAuth, async (req, res, next) => {

      const {classId} = req.params

      if(!classId){
        return res.status(400).json({error: 'Need class id'})
      }

    try {
    
      const dates = await dataService.getTimeForGoal(req.app.get('db'), classId)
      let time;
      let created=''
      let completed=''
      let dateArr=[]
     
    
      for(let i=0; i < dates.length; i++){
     

        // created = dates[i]["date_created"].toTimeString().slice(0,5)       
        // completed = dates[i]["date_completed"].toTimeString().slice(0,5) 
        let createdHours = Number(dates[i]["date_created"].getHours()) 
        let completedHours = Number(dates[i]["date_completed"].getHours())
        let createdMins = Number(dates[i]["date_created"].getMinutes())
        let completedMins= Number(dates[i]["date_completed"].getMinutes())
        
        // time = Number(completed) - Number(created)
        

       let totalCreatedMins = (createdHours * 60) + createdMins
       let totalCompletedMins = (completedHours * 60) + completedMins
       let totalMins = totalCompletedMins - totalCreatedMins
       let hours = Math.floor(totalMins/60).toString();
       let mins = (totalMins % 60).toString()
       if(hours < 10){
        hours = `0${hours}`
       }
       if(mins < 10){
        mins = `0${mins}`
       }
       time = `${hours}h ${mins}m`
       dateArr.push({id: dates[i]["id"], goal_title: dates[i]["goal_title"], time: time, })
      }
      console.log(time)
      console.log(dateArr);

      res.status(200).json({dateArr})
    }
    catch(e){
      next(e)
    }
  })

  module.exports = dataRouter