const mongoose = require('mongoose');

const panSchema= mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'userid is required']
    },
  panNumber:{
    type:String,
      required:[true,"adhar number is required !"]
  },
  panFrontPhoto:{
    type:String,
    required:[true,"adhar photo is missing !"]
  },

  name:{
    type:String,
    required:[true,"name is require"]
  },
    timestamp:{
        type:Date,
        default:Date.now(),
        required:true,
        get:(timestamp)=>timestamp.getTime(),
        set:(timestamp)=>new Date(timestamp),
    }
})


module.exports=mongoose.model("Pan",panSchema);






























