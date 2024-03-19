const express = require('express');

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utiles/validators/userValidator');

 const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require('../services/user.service');

const {
  
  data,protect,
 
} = require('../services/auth.service');

const router = express.Router();


router.route("/changePassword/:id").put(protect,changeUserPasswordValidator,changeUserPassword);

router
.route('/')
.get(getUsers)
.post(uploadUserImage, resizeImage, createUserValidator,createUser);

router
.route('/:id')
.get( getUser)
.put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
.delete( deleteUserValidator,deleteUser);


  module.exports = router;


/*










 */