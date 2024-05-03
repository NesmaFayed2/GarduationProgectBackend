const { consumeAndProcessMessages } = require('./test.js'); // Import the consumeAndProcessMessages function
const User=require('./models/user.model');



// Function to perform consuming messages in the background
const performConsumingInBackground = async () => {
    try {
        await consumeAndProcessMessages();

    } catch (error) {
        console.error('Error consuming messages:', error);
    }
 
};

performConsumingInBackground()


module.exports={performConsumingInBackground}



