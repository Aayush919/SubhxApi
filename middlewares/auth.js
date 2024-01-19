const jwt=require('jsonwebtoken');
const ErorrHandlers=require("../utills/ErorrHandlers.js");
const { catchAsyncErorrs } = require('./catchAsyncErorrs');


const isAuth=catchAsyncErorrs(async(req,res,next)=>{
    const {token}=req.cookies
    
    if(!token){
        return next(new ErorrHandlers("please log in  to access the reource...",401))
    }
    const {id}=jwt.verify(token,process.env.JWT_SECRET);
    console.log(id);
    req.id=id;
   next();
})

module.exports={isAuth};