const mongoose = require('mongoose');


const CameraSchema= new mongoose.Schema({
    
    ip:String
    ,
    name:{type:String
    , unique: true}
    ,
    screenshots:{type:[String],
    default:[]}
    ,
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    }
}

 ,{timestamps:true});


 const Camera=mongoose.model('Camera',CameraSchema);

 module.exports= Camera;