
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'FirstName is required']
    },
    lastName:{
        type:String,
        required:[true,'lastName is required']
    },
    phone:{
        type:Number,
        required:[true,'phone number is requiref']
    },

    email: {
        unique:true,
        type: String,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],

    },
    password:{
        type:String,
        required:[true,'password is missing'],
        select:false,
        maxLength:[15,"password should not exceed more than 15 characters"],
        minLength:[6,"password should have atleast  6 characters"],
    },
    adhar:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Adhar",
    },
    pan:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pan",
    },
    is_verified:{
        type:Boolean,
        default:false,
    }

}, { timestamps: true })



userSchema.pre("save",function( ){
    if(!this.isModified("password")){
        return;
    }
    let salt=bcrypt.genSaltSync(10);
    this.password=bcrypt.hashSync(this.password,salt);
});


userSchema.methods.comparepassword=function(password){

     return bcrypt.compareSync(password,this.password);
};
userSchema.methods.getJwtToken=function(){
  
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
};

module.exports=mongoose.model('User',userSchema);