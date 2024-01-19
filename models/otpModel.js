const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required']
    },
    mailOtp:{
        type:Number,
        required:[true,'please fill otp'],

    },
    timestamp:{
        type:Date,
        default:Date.now(),
        required:true,
        get:(timestamp)=>timestamp.getTime(),
        set:(timestamp)=>new Date(timestamp),
    }
})


module.exports=mongoose.model("Otp",otpSchema);






























