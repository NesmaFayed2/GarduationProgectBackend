const express = require('express');
const userRoute= require('./routes/user.route');
const authRoute=require('./routes/auth.route');
const bodyParser = require('body-parser');



const app=express();
const port = 4001||process.env.Port;

//_____________________
app.use(bodyParser.json());
app.use(express.json());
// Increase the limit for request body size (e.g., 10MB)
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));

// routes
app.use('/api/v1/users',userRoute);
app.use('/api/v1/auth',authRoute);


//connect to database
const mongoose =require('mongoose'); 
const url = 'mongodb+srv://nesmaF:123456789n@cluster0.hooobf4.mongodb.net/DataBase?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(url).then(()=>{
    console.log('mongodb connected successfully');
});







app.listen(port, () => {
    console.log(`App running running on port ${port}`);
  });