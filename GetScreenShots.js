
const User=require('./models/user.model');
const Camera=require('./models/camera.model');
const amqp=require('amqplib');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const {consumeMessages}=require('./consumeDataFromPython')
const path = require('path');
const sharp = require('sharp');

exports.SetScreenshots = asyncHandler(async (req, res, next) => {


//Get screenshots from queue assume that it's a json file

//read json file: 
const fileName = 'DataConsumed.json';
fs.readFile(fileName, 'utf8', async (err, data) => {

    if (err) {
        console.error('Error reading file:', err);
        return next(err);
    }

    // Parse the JSON data
    try {
        const jsonData = JSON.parse(data);
    
        let user = await User.findById(jsonData.message.userId);
        if (!user) {
          return res.status(404).send('User not found');
          }
        camera = await user.cameras.find(camera => camera.ip === jsonData.message.cameraIp);
        if (!camera) {
          return res.status(404).send('Camera not found');
          }
          
           // Convert base64 encoded screenshot to buffer
         const imageBuffer = await Buffer.from(jsonData.message.screenshot, 'base64');
        const camip=jsonData.message.cameraIp;
        console.log(camip)
        // Create directory for camera IP if not exists
        let screenshotsDirectory = path.join(__dirname,camip);
        await fs.promises.mkdir(screenshotsDirectory, { recursive: true });

        // Save screenshot as file
        const screenshotFileName = `${Date.now()}.jpg`;
        const screenshotFilePath = path.join(screenshotsDirectory, screenshotFileName);
        await sharp(imageBuffer).toFile(screenshotFilePath);

        // Store file path in MongoDB
        camera.screenshots.push(screenshotFilePath);
       
         await User.findByIdAndUpdate(jsonData.message.userId, user, { new: true });

         next();
      } catch (err) {
        console.error('Error processing screenshot:', err);
        // Handle other potential errors here
        next(err);
      }
     
      
});

   
   });

//_____________________________________________________
