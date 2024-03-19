const { body,check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Camera = require('../../models/camera.model');
const jwt=require('jsonwebtoken');

exports.AddCameraValidator = [
    check('name')
    .optional()
    ,
    check('ip')
    .notEmpty()
    .withMessage('IP required')
    .isIP()
    .withMessage('Invalid IP').custom((val) =>
    Camera.findOne({ ip: val }).then((camera) => {
      if (camera) {
        return Promise.reject(new Error('Camera already exists'));
      }
    }))
    ,
   check('screenshots').optional()
   
   ,
   validatorMiddleware
];