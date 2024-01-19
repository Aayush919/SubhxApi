const mongoose=require('mongoose');

exports.connectDatabase=async()=>{
    try{
  await mongoose.connect(process.env.MONGO_URL)
  console.log('Database coneection established')
    }
    catch(error){
        console.log(error)
    }
}


//online connected


