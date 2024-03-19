const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true , "Name required" ]
    },
    slug:{
      type:String,
      lowercase: true,
    }
,
    email:{
        type:String,
        required:[true , "Email is required" ],
        uinique:true,
        lowercase:true

    },
    phone:String,
    profileImage:String,

    password: {
        type:String ,
        required:[true , "Password is required"],
        minlength:[6, "Too short password"]

    },

    role:{
        type:String,
        enum:["user" , "admin"],
        default:"user"

    },
    
    anothermail:{type:[String]
    ,default: []
    }
    , 
    anotherphone:{type:[String]
        ,default: []
        }

    ,
    cameras:[{type:mongoose.Schema.Types.Object, ref:'Camera' }]

    }


 ,{timestamps:true});

 userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next();
  //hashing user password
  this.password =  await bcrypt.hash(this.password,12);
  next();

 });


 const User=mongoose.model('User',userSchema);

 module.exports= User;
