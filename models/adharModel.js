const mongoose = require('mongoose');

const adharSchema= mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'userid is required']
    },
  adharNumber:{
    type:String,
      required:[true,"adhar number is required !"]
  },
  adharFrontPhoto:{
    type:String,
    required:[true,"adhar photo is missing !"]
  },
  adharBackPhoto:{
    type:String,
    required:[true,"adhar photo is missing !"]
  },
    timestamp:{
        type:Date,
        default:Date.now(),
        required:true,
        get:(timestamp)=>timestamp.getTime(),
        set:(timestamp)=>new Date(timestamp),
    }
})


module.exports=mongoose.model("Adhar",adharSchema);






























