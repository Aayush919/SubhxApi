const mongoose = require("mongoose");
const id3 = require("node-id3");
const { Readable } = require("stream");
const crypto = require("crypto");
const { catchAsyncErorrs } = require("../middlewares/catchAsyncErorrs");
const adharModel=require("../models/adharModel.js");
const userModel=require("../models/userModel.js");

const conn = mongoose.connection;
let adharFrontBucket;
let adharBackBucket;

conn.once('open', () => {
  adharFrontBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'adharFront'
  });

  adharBackBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'adharBack'
  });
});




const uploadAdhar=catchAsyncErorrs(async (req,res)=>{

  const adharNumber=req.body.adharNumber;
  const userId=req.body.userId;
  const frontPhotoData = id3.read(req.files['frontPhoto'][0].buffer);
  const backPhotoData = id3.read(req.files['backPhoto'][0].buffer);


  const randomFrontName = crypto.randomBytes(19).toString("hex");
  const randomBackName = crypto.randomBytes(19).toString("hex");

  const readableFrontStream = Readable.from(req.files['frontPhoto'][0].buffer);
  const readableBackStream = Readable.from(req.files['backPhoto'][0].buffer);

  const frontUploadStream = adharFrontBucket.openUploadStream(randomFrontName);
  const backUploadStream = adharBackBucket.openUploadStream(randomBackName);

  readableFrontStream.pipe(frontUploadStream);
  readableBackStream.pipe(backUploadStream);

  frontUploadStream.on('error', (error) => {
    return next(new ErorrHandler("error on uploading adhar" ,400))
  });

  backUploadStream.on('error', (error) => {
    return next(new ErorrHandler("error on uploading adhar" ,400))
  });

  frontUploadStream.on('finish', () => {
    backUploadStream.on('finish', () => {
      console.log("Adhar photos uploaded successfully")
    });
  });

  const adharData=await adharModel.create({
    userId,
    adharFrontPhoto:randomFrontName,
    adharBackPhoto:randomBackName,
    adharNumber
  })

  const adharId=adharData.id;


  const user= await userModel.findOneAndUpdate({ _id:userId }, { adhar:adharId},
  {  new: true}
)


  res.status(200).json("adhar data uploaded !");
})


module.exports={uploadAdhar};

