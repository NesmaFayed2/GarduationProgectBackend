const jwt=require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utiles/apiError');
const Camera=require('../models/camera.model');
const factory = require('./handlersFactory');
const User=require('../models/user.model');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const {connect}=require('../publishCameraData')



   // @desc    ADD CAMERA
   // @route   GET /api/v1/auth/addcamera
   // @access  public
  exports.addCamera=asyncHandler(async (req,res,next)=>{
     const Currentuser = await User.findById(req.user._id);
    const camera =await Camera.create({
        ip:req.body.ip,
        name:req.body.name,
        user:req.user._id,
        port:req.body.port,
        username:req.body.username,
        password:req.body.password
    });
    Currentuser.cameras.push(camera);
    await Currentuser.save();
    //create json file
    Cameradata=Currentuser.cameras;
    const userData = JSON.stringify({ Cameradata });
    const filename = `CameraData.json`;
    fs.writeFileSync(filename, userData, (err) => {
        if (err) {
            console.error("Error writing user data to file:", err);
            return next(new ApiError("Failed to create user data file"));
        }
        console.log("User data file created successfully:", filename);
    });
    connect();

    res.status(201).json({ Currentuser });
    
});




exports.getCameraNames=asyncHandler(async (req, res, next) => {
  
    const Currentuser = await User.findById(req.user._id);
    const cameraNames = Currentuser.cameras.map(camera => camera.name);
    res.status(200).json({  data: cameraNames });
    
  });

  exports.getSingleCamera=asyncHandler(async (req, res, next) => {
    const Currentuser = await User.findById(req.user._id);
    const cameraName=req.body.name.toLowerCase();
    const camera = Currentuser.cameras.filter(camera => camera.name.toLowerCase() == cameraName);
    console.log(camera)
    if(camera.length===0){
      res.status(404).json({  data: "camera not existed"});
    }else {
      res.status(200).json({  data: camera});
    }
   
  });


  exports.deletecamera = asyncHandler(async (req, res, next) => {
   


    const cameraName=req.body.name;
    const camera = await Camera.findOneAndDelete({ name: cameraName });
    const user = await User.findById(req.user._id);
    user.cameras =await user.cameras.filter(camera => camera.name.toLowerCase() !== cameraName.toLowerCase());
    await user.save();





    
  //create json file
   Cameradata=user.cameras;
   const userData = JSON.stringify({ Cameradata });
    const filename = `CameraData.json`;
    fs.writeFileSync(filename, userData, (err) => {
     if (err) {
         console.error("Error writing user data to file:", err);
         return next(new ApiError("Failed to create user data file"));
     }
     console.log("User data file created successfully:", filename);
 });

    res.status(200).json({ success: true, data: user }); 
    connect();
    
  });




exports.editcamera=asyncHandler(async (req, res, next) => {
  const updatedData = {
    ip: req.body.ip,
    name: req.body.name,
    user: req.user._id,
    port: req.body.port,
    username: req.body.username,
    password: req.body.password
};
  const user = await User.findById(req.user._id);
  const cameraName = req.body.name;
  const cameraIndex = user.cameras.findIndex(camera => camera.name === cameraName);
  if (cameraIndex === -1) {
    return next(new ApiError("Camera not found", 404));
}
  const camera = await Camera.findOneAndUpdate({name:cameraName},updatedData,{
    new: true,
  }  );
  // Update only the specific camera's data in the user's cameras array
  user.cameras[cameraIndex] = { ...user.cameras[cameraIndex], ...updatedData };
 
  await user.save()

  //create json file
  Cameradata=user.cameras;
  const userData = JSON.stringify({ Cameradata });
   const filename = `CameraData.json`;
   fs.writeFileSync(filename, userData, (err) => {
    if (err) {
        console.error("Error writing user data to file:", err);
        return next(new ApiError("Failed to create user data file"));
    }
    console.log("User data file created successfully:", filename);
});
  
   res.status(200).json({ data: camera });
   connect();
   
  
  
});
//______________________________________________________________________


  




