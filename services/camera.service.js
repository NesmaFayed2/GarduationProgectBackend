const jwt=require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utiles/apiError');
const Camera=require('../models/camera.model');
const factory = require('./handlersFactory');
const User=require('../models/user.model');



   // @desc    ADD CAMERA
   // @route   GET /api/v1/auth/addcamera
  // @access  public
  exports.addCamera=asyncHandler(async (req,res,next)=>{
    const Currentuser = await User.findById(req.user._id);
    const camera =await Camera.create({
        ip:req.body.ip,
        name:req.body.name,
        user:req.user._id 
    });
    Currentuser.cameras.push(camera);
    Currentuser.save();

    res.status(201).json({date:camera});

});


exports.deletecamera = asyncHandler(async (req, res, next) => {
     const cameraName=req.body.name;
     const camera = await Camera.findOneAndDelete({ name: cameraName });
     const user = await User.findById(req.user._id);
     user.cameras = user.cameras.filter(camera => camera.name !== req.body.name);
     await user.save();
     res.status(200).json({ success: true, data: user }); 
     
   });


exports.getCameraNames=asyncHandler(async (req, res, next) => {
    const Currentuser = await User.findById(req.user._id);
    const cameraNames = Currentuser.cameras.map(camera => camera.name);
    res.status(200).json({  data: cameraNames });
    
  });

  exports.getSingleCamera=asyncHandler(async (req, res, next) => {
    const Currentuser = await User.findById(req.user._id);
    const cameraName=req.body.name;
    const camera = await Camera.findOne({ name: cameraName });
    res.status(200).json({  data: camera});
    
  });

  




