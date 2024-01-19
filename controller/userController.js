const { catchAsyncErorrs } = require("../middlewares/catchAsyncErorrs");
const otpModel = require("../models/otpModel.js");
const User = require("../models/userModel.js");
const ErorrHandler = require("../utills/ErorrHandlers.js");
const { sendToken } = require("../utills/sendToken.js");
const { oneMinute, TenMinute } = require("../middlewares/otpValidation.js");
const { sendMail } = require("../utills/nodeMailer.js");










//dont need to put try catch beacause already handle
// try catch async error in ../middlewares/catchAsyncErorrs


const home = catchAsyncErorrs(async (req, res) => {
  res.json({ message: "home page..." })
})


//@description 
const signUp = catchAsyncErorrs(async (req, res, next) => {
  console.log(req.body.password);
  const user = await new User(req.body).save();
  sendToken(user, 201, res);
});




const generateRandomDigit = async () => {
  return Math.floor(100000 + Math.random() * 900000);
}

const send = catchAsyncErorrs(async (req, res, next) => {
  const { email} = req.body;

  // const phoneNo = phone.toString().slice(-10);

  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    return next(new ErorrHandler("user not found whith this email", 500));
  }

  const oldOtp = await otpModel.findOne({email:email });

  if (oldOtp) {
    const senNextOtp = await oneMinute(oldOtp.timestamp);

    if (!senNextOtp) {
      return next(new ErorrHandler("try after some times", 500));
    }
  }


  const date = new Date();
  const onetime = await generateRandomDigit();
  const otp = await otpModel.findOneAndUpdate({ email:email }, { mailOtp: onetime, timestamp: new Date(date.getTime()) },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )


  const emailMsg = `<p> hii ${user.email} ,</br> <h4>${onetime}</h4> </p>`;
  


  const isMailSend = await sendMail(req, res, next, emailMsg);


  if(!isMailSend){
    return next(new ErorrHandler("Error whith sending otp..", 500));
  }





  res.status(200).json({message:"otp send !"})

  


});









const verifyOtp = catchAsyncErorrs(async (req, res, next) => {
  const { email, mailOtp} = req.body;
  // const phoneNo=phone.slice(-10)
  const otpData = await otpModel.findOne({ email, mailOtp }).exec();

  if (!otpData) {
    return next(new ErorrHandler("you entered wrong otp", 400))
  }
  const isExpire = await TenMinute(otpData.timestamp);

  if (isExpire) {
    return next(new ErorrHandler("you otp has been expire", 400))
  }





const updatedUser = await User.findOneAndUpdate(
  { email: email},
  { $set: { is_verified: true } },
  { new: true }
);

return res.status(200).json({ message: "Your account has been verified..." });


})
module.exports = { home, signUp,verifyOtp, send }