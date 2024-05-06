const express = require('express');

//user imports
const {
  SignUpValidator
  ,LogInValidator
  ,changeLoggedUserPasswordValidator,
  editUsernameValidator, 
  editemailValidator,
  editphoneValidator,
  anoteremailValidator,
  anoterphoneValidator
} = require('../utiles/validators/authValidator');
 const {
  signup,
  uploadUserImage,
  resizeImage,
  login,data,protect,
  updateLoggedUserPhone,
  updateLoggedUserPassword,
  updateLoggedUserName,
  updateLoggedUserEmail,
  getUser
  ,getLoggedUserData,
  deleteLoggedUserData,
  addanothermail,
  addanotherphone ,
  deleteanothermail,
  deleteanotherphone,loginTest,loginTest2,loginTest3,encodeimage,getallscreenhistory,getwarnings

} = require('../services/auth.service');
//__________________________________________________________________
//camera imoprts
const {
  AddCameraValidator
} = require('../utiles/validators/cameraValidator');
const {
  addCamera,
  deletecamera,
  getCameraNames,
  
  getSingleCamera,editcamera
  
} = require('../services/camera.service');

//________________________________________________________________________
const {SetScreenshots}=require('../GetScreenShots')

//_________________________________________________________________________
const {consumeMessages}=require('../consumeDataFromPython')
//__________________________________________________________________________
const {consumeAndProcessMessages}=require("../test.js")
//)__________________________________________________________________________
const {performConsumingInBackground}=require('../CycleOfConsuming.js')




const router = express.Router();


//__________________________________________________________________________
//signup and login 
router.route('/signup').post(uploadUserImage, resizeImage,SignUpValidator ,signup);
router.route('/login').post(LogInValidator,login);
router.route('/consume').post(performConsumingInBackground);



//__________________________________________________________________________
//update password : 
router.put('/changeMyPassword',protect,changeLoggedUserPasswordValidator,updateLoggedUserPassword);
//__________________________________________________________________________
//get my data after login 
router.get('/getMe', protect,getLoggedUserData,getUser);
//__________________________________________________________________________
//update username
router.route('/updateusername').put(protect,editUsernameValidator,updateLoggedUserName);
//__________________________________________________________________________
//update email 
router.route('/updateemail').put(protect,editemailValidator,updateLoggedUserEmail);
//___________________________________________________________________________
//update phone 
router.route('/updatephone').put(protect,editphoneValidator,updateLoggedUserPhone);
//___________________________________________________________________________
//deactivate account
router.route('/deleteMe').delete( protect,deleteLoggedUserData);
//___________________________________________________________________________
//add another mail 
router.route('/addanothermail').put( protect,anoteremailValidator,addanothermail);
//delete another mail 
router.route('/deleteanothermail').put(protect,anoteremailValidator,deleteanothermail);
//___________________________________________________________________________
//add another phone
router.route('/addanotherphone').put(protect,anoterphoneValidator,addanotherphone);
//delete another phone
router.route('/deleteanotherphone').put(protect,anoterphoneValidator,deleteanotherphone);
//_______________________________________________________________________________
//Camera options 
router.route('/addcamera').post(protect,AddCameraValidator ,addCamera);

router.route('/deletecamera').put(protect,deletecamera);

router.route('/getcameras').get(protect,getCameraNames);

router.route('/getsinglecamera').get(protect,getSingleCamera);

router.route('/editcamera').put(protect,AddCameraValidator,editcamera);


//___________________________________________________________
router.route('/decode').get(encodeimage);

//____________________________________________________________
//get all screen for one camera
router.route('/getscreenforone').get(protect,getallscreenhistory);
//_____________________________________________________________
//get immediate warnings
router.route('/warnings').get(getwarnings);












  module.exports = router;


/*










 */