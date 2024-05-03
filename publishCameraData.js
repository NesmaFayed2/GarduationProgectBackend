const amqp = require('amqplib');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

exports.connect = asyncHandler(async (req, res, next) => {
    let msg = {};

    // Read JSON file synchronously
    try {
        const fileName = 'CameraData.json';
        const data = fs.readFileSync(fileName, 'utf8');
        msg = JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return next(err);
    }

    try {
        
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const result = await channel.assertQueue("CameraData");
        channel.sendToQueue("CameraData", Buffer.from(JSON.stringify(msg)));
        console.log(`Data sent successfully ${msg}`);

       

 
    } catch (err) {
        console.error(err);
        return next(err);
    }
});
