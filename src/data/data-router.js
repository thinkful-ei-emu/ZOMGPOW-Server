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

      console.log(dates);

      res.status(200).json({dates})
    }
    catch(e){
      next(e)
    }
  })

  module.exports = dataRouter