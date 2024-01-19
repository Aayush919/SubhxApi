const generatedErorrs=(err,req,res,next)=>{
    const statusCode=err.statusCode||500

if(err.name==='MongoServerError'&& err.message.includes('E11000 duplicate key')){
   err.message='User whith this email adress already exist..'
}
   res.status(statusCode).json({
        message:err.message,
        name:err.name,
        stack:err.stack
    })
}

module.exports={generatedErorrs};