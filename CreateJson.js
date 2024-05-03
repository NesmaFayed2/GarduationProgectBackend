
const fs = require('fs');
const User = require('./models/user.model');
const asyncHandler = require('express-async-handler');

// File Name
const fileName = 'CameraData.json';


    async function createJsonFile(user) {
    try {
        // Query the collection and retrieve data using Mongoose
        const data = await User.find().lean(); // Use lean() to convert Mongoose documents to plain JavaScript objects

        // Write data to a JSON file
        fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
            console.log('Data has been written to', fileName);
        });
    } catch (err) {
        console.error('Error:', err);
    }

}   

module.exports={createJsonFile};


