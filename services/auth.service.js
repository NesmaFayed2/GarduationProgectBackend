require('dotenv').config();
const jwt=require('jsonwebtoken');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utiles/apiError');
const User=require('../models/user.model');
const factory = require('./handlersFactory');
const fs = require('fs');
const fsExtra = require('fs-extra');
const {connect}=require('../publishCameraData')
const{consumeAndProcessMessages}=require("../test.js")






const createToken=(payload)=>{
    return jwt.sign({userId:payload},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_TIME});      
}



exports.uploadUserImage = uploadSingleImage('profileImage');
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/users/${filename}`);
  
      // Save image into our db
      req.body.profileImg = filename;
    }
  
    next();
  });
  
  // @desc    Sign up
  // @route   GET /api/v1/auth/signup
  // @access  public
exports.signup=asyncHandler(async (req,res,next)=>{
   
    //1- create user
    const user =await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        profileImage:req.body.profileImage,
        anothermail:req.body.anothermail,
        anotherphone:req.body.anotherphone,
    });
    //2-generate token
     const token = createToken(user._id) ; 
    
    res.status(201).json({date:user , token:token});


});

    // @desc    login
   // @route   GET /api/v1/auth/login
  // @access  public
//#########################################################################
  exports.loginTest = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError("Incorrect Email"));
    }
    if (!await bcrypt.compareSync(req.body.password, user.password)) {
        return next(new ApiError("Incorrect Password"));
    }

    const token = createToken(user._id);

    // Serialize user data to JSON format
    const userData = JSON.stringify({ user, token });

    // Write user data to a JSON file
    const filename = `${user.email}_userData.json`;
    fs.writeFile(filename, userData, (err) => {
        if (err) {
            console.error("Error writing user data to file:", err);
            return next(new ApiError("Failed to create user data file"));
        }
        console.log("User data file created successfully:", filename);
    });

    res.status(201).json({ user, token });
});
exports.loginTest2 = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
      return next(new ApiError("Incorrect Email"));
  }
  if (!await bcrypt.compareSync(req.body.password, user.password)) {
      return next(new ApiError("Incorrect Password"));
  }

  const token = createToken(user._id);

  // Path to the existing folder to be copied
  const sourceFolder = './User-X';
  // Path to the destination folder (create a unique folder for each user)
  const destinationFolder = `./User-${user.name}`;

  try {
      // Check if the source folder exists
      if (!fs.existsSync(sourceFolder)) {
          return next(new ApiError("Source folder does not exist"));
      }

      // Copy the folder recursively to the destination
      await fsExtra.copy(sourceFolder, destinationFolder);

      // Optionally, you can perform additional setup or modifications to the copied folder here

      console.log(`Folder copied successfully for user ${user.email}`);
      

  // Send response with user data and token
  res.status(201).json({ user, token });
      // Send response with user data and token
      res.status(201).json({ user, token });
  } catch (err) {
      console.error("Error copying folder:", err);
      return next(new ApiError("Failed to copy folder"));
  }

  
});

exports.loginTest3 = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
      return next(new ApiError("Incorrect Email"));
  }
  if (!await bcrypt.compareSync(req.body.password, user.password)) {
      return next(new ApiError("Incorrect Password"));
  }

  const token = createToken(user._id);

  // Path to the folder containing the user's data
  const folderPath = `./User-${user.name}`;
  // Path to the existing JSON file within the user's folder
  const jsonFilePath = `./User-${user.name}/JsonFile.json`;

  try {
    let jsonData = {};

    // Check if JSON file exists
    if (fs.existsSync(jsonFilePath)) {
        // Read existing JSON file
        const existingData = fs.readFileSync(jsonFilePath, 'utf8');
        // Parse existing JSON data
        jsonData = JSON.parse(existingData);
    }
    

    // Update JSON data with new user and token
    jsonData.user = user;
    jsonData.token = token;

    // Serialize updated JSON data
    const updatedData = JSON.stringify(jsonData, null, 2);

    // Write updated data back to the JSON file
    fs.writeFileSync(jsonFilePath, updatedData);

    console.log("User data updated successfully:", jsonFilePath);

    res.status(201).json({ user, token });
} catch (err) {
    console.error("Error updating user data:", err);
    return next(new ApiError("Failed to update user data"));
}
});


exports.login = asyncHandler(async (req, res, next) => {

 
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError("Incorrect Email"));
    }
    if (!await bcrypt.compareSync(req.body.password, user.password)) {
        return next(new ApiError("Incorrect Password"));
    }
    Cameradata=user.cameras;

    const token = createToken(user._id);

    // SEND CAMERA DATA AS JSON FILE
    const userData = JSON.stringify({ Cameradata });
    console.log(userData);
    const filename = `CameraData.json`;
    fs.writeFileSync(filename, userData, (err) => {
        if (err) {
            console.error("Error writing user data to file:", err);
            return next(new ApiError("Failed to create user data file"));
        }
        console.log("User data file created successfully:", filename);
    });
    connect();

    
  
    res.status(201).json({ user, token });
  
   

});
//##########################################################################
//just for test
exports.data=asyncHandler(async (req,res,next)=>{
   console.log(req.headers.authorization);
  });


// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access this route',
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError('The user that belong to this token does no longer exist',401)
);
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError('User recently changed his password. please login again..', 401));
    }
  }

  req.user = currentUser;


  
  next();
});
//_______________________________________________________________

// @desc    Update logged user password
// @route   PUT /api/v1/auth/changeMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});
//_________________________________________________
// @desc    Get Logged user data
// @route   GET /api/v1/auth/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});





//_____________________________________________________
// @desc    Update logged user NAME 
// @route   PUT /api/v1/auth/updateusername
// @access  Private/Protect
exports.updateLoggedUserName = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});
//_____________________________________________________
// @desc    Update logged user EMAIL
// @route   PUT /api/v1/auth/updateemail
// @access  Private/Protect
exports.updateLoggedUserEmail = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {

      email: req.body.email,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});
//______________________________________________________
// @desc    Update logged user EMAIL
// @route   PUT /api/v1/auth/updatephone
// @access  Private/Protect
exports.updateLoggedUserPhone = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {  
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

//__________________________________________________
exports.getUser = factory.getOne(User);
//_______________________________________________________
// @desc    Deactivate logged user
// @route   DELETE /api/v1/auth/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id, { active: false });
  res.status(200).json({ Account:"Deactivated" });
});
//____________________________________________________________
// @desc   add other mail
// @route   DELETE /api/v1/auth/addanothermail
// @access  Private/Protect
exports.addanothermail = asyncHandler(async (req, res, next) => { 
 
 const user = await User.findById(req.user._id);
 user.anothermail.push(req.body.anothermail);
 
  await user.save();
  res.status(200).json({ success: true, data: user }); 
  
});
//____________________________________________________________
// @desc   add other phone
// @route   DELETE /api/v1/auth/addanotherphone
// @access  Private/Protect
exports.addanotherphone = asyncHandler(async (req, res, next) => {
  
  const user = await User.findById(req.user._id);
  user.anotherphone.push(req.body.anotherphone);
  
   await user.save();
   res.status(200).json({ success: true, data: user }); 
   
 });
 //__________________________________________________________
 // @desc   delete other phone
// @route   DELETE /api/v1/auth/deleteanotherphone
// @access  Private/Protect
exports.deleteanothermail = asyncHandler(async (req, res, next) => {
  
  const user = await User.findById(req.user._id);
  user.anothermail = user.anothermail.filter(email => email !== req.body.anothermail);
   await user.save();
   res.status(200).json({ success: true, data: user }); 
   
 });

 //__________________________________________________________
 // @desc   delete other phone
// @route   DELETE /api/v1/auth/deleteanotherphone
// @access  Private/Protect
exports.deleteanotherphone = asyncHandler(async (req, res, next) => {
  
  const user = await User.findById(req.user._id);
  user.anotherphone = user.anotherphone.filter(email => email !== req.body.anotherphone);
   await user.save();
   res.status(200).json({ success: true, data: user }); 
   
 });
 //_________________________________________________________









