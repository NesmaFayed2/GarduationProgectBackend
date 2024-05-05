const amqp = require('amqplib');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const ApiError = require('./utiles/apiError');
const {SetScreenshots}=require('./GetScreenShots')

async function consumeAndProcessMessages() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        if(!channel){
            console.log("no connection")
        }

        await channel.assertExchange('screenshots', 'direct');

        const queue = await channel.assertQueue('192.168.1.130');

        await channel.bindQueue(queue.queue, 'screenshots', '192.168.1.130');

        console.log('Waiting for messages. To exit, press CTRL+C');

        channel.consume(queue.queue, async (msg) => {
            try {
                if (msg !== null) {
                    const data = JSON.parse(msg.content.toString());

                     const filename = `DataConsumed.json`;
                    fs.writeFileSync(filename,msg.content, (err) => {
                        if (err) {
                            console.error("Error writing user data to file:", err);
                            throw new ApiError("Failed to create user data file");
                        }
                        console.log("User data file created successfully:", filename);
                    });

                   await console.log('Received message:', data);
//#####################################################################################
                    console.log('give the data in the json file to database');
                    SetScreenshots()
                    console.log('data transimitted to database succussfully')

                    // Acknowledge the message to remove it from the queue
                    channel.ack(msg);
                    console.log('data removed from the queue')
                    
                }
            } catch (error) {
                console.error('Error processing message:', error);
                // Reject the message if it cannot be processed
                channel.reject(msg, false); // Set requeue to false to discard the message
            }
        });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
}




module.exports = {consumeAndProcessMessages};
