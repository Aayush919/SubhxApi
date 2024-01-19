const mongoose = require("mongoose");
const id3 = require("node-id3");
const { Readable } = require("stream");
const crypto = require("crypto");
const { catchAsyncErorrs } = require("../middlewares/catchAsyncErorrs");
const panModel=require("../models/panModel.js")
const userModel=require("../models/userModel.js")

const conn = mongoose.connection;
let panFrontBucket;


conn.once('open', () => {
  panFrontBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'panPhoto'
  });

});




const uploadPan=catchAsyncErorrs(async (req,res,next)=>{
  const panNumber=req.body.panNumber;
  const userId=req.body.userId;
  const name=req.body.panName;

  const frontPhotoData = id3.read(req.files['panPhoto'][0].buffer);
  console.log(frontPhotoData);


  const randomName = crypto.randomBytes(19).toString("hex");



  const readableFrontStream = Readable.from(req.files['panPhoto'][0].buffer);


  const frontUploadStream = panFrontBucket.openUploadStream(randomName);
 

  readableFrontStream.pipe(frontUploadStream);


  frontUploadStream.on('error', (error) => {
    return next(new ErorrHandler("error on uploading pancard", 400))
  });


  frontUploadStream.on('finish', () => {
      console.log("Pan photo uploaded successfully")
  });

  const panData=await panModel.create({
    name,
    userId,
    panFrontPhoto:randomName,
    panNumber
  })

  const panId=panData.id;


  const user= await userModel.findOneAndUpdate({ _id:userId }, { pan:panId},
  {  new: true})

  res.status(200).json("pan data uploaded !");
})


module.exports={uploadPan};

