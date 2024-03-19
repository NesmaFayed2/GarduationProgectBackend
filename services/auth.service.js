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

exports.login=asyncHandler(async (req,res,next)=>{
  
  const user=await User.findOne({email:req.body.email});
  if(!user){
    return next(new ApiError("Incorrect Email"));
  }
  if(!await bcrypt.compareSync(req.body.password,user.password)){
    return next(new ApiError("Incorrect  Password"));
    
  }
   
  const token =createToken(user._id) ;
  res.status(201).json({date:user , token:token});
  

});

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
// @route   GET /api/v1/auth//getMe
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







