const amqp=require('amqplib');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const ApiError = require('./utiles/apiError');

exports.consumeMessages=asyncHandler(async (req, res, next) =>{
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();

        await channel.assertExchange('Screenshots', 'direct');

        const queue = await channel.assertQueue('128.2.150.7');

        await channel.bindQueue(queue.queue, 'Screenshots', '128.2.150.7');

        console.log('Waiting for messages. To exit, press CTRL+C');

        channel.consume(queue.queue, (msg) => {
            try {
                if (msg !== null) {
                    const data = JSON.parse(msg.content.toString());
                    
                    const filename = `DataConsumed.json`;
    fs.writeFileSync(filename, msg.content.toString(), (err) => {
        if (err) {
            console.error("Error writing user data to file:", err);
            return next(new ApiError("Failed to create user data file"));
        }
        console.log("User data file created successfully:", filename);
    });
                    console.log('Received message:', data);               
     // Acknowledge the message to remove it from the queue
                    channel.ack(msg);
                   
                    
                }
            } catch (error) {
                console.error('Error processing message:', error);
                // Reject the message if it cannot be processed
                channel.reject(msg, false); // Set requeue to false to discard the message
            }
        });
      
        res.status(201).json({ "created":"success" });
        
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
})


  
   
