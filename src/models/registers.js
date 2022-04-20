const mongoose = require("mongoose");
const validator = require("validator")
const userInfo = new mongoose.Schema({

    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            { 
                throw new Error("Envalid email");
 
            }
        }
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        minlength:10,
        unique:true

    }
})

const Register = new mongoose.model("Register",userInfo)

module.exports = Register;