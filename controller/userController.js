const { catchAsyncErorrs } = require("../middlewares/catchAsyncErorrs");
const otpModel = require("../models/otpModel.js");
const User = require("../models/userModel.js");
const ErorrHandler = require("../utills/ErorrHandlers.js");
const { sendToken } = require("../utills/sendToken.js");
const { oneMinute, TenMinute } = require("../middlewares/otpValidation.js");
const { sendMail } = require("../utills/nodeMailer.js");
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);








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

// const signIn = catchAsyncErorrs(async (req, res, next) => {
//   const { password } = req.body;
//   const user = await User.findOne({ email: req.body.email }).select("+password").exec();
//   if (!user) {
//     return next(new ErorrHandler("user not found whith this email adresss.", 404))
//   }
//   const isMatch = user.comparepassword(password);
//   if (!isMatch) {
//     return next(new ErorrHandler("wrong credntials", 500))
//   }
//   sendToken(user, 200, res);
// })


// signOut
// const signOut = catchAsyncErorrs(async (req, res, next) => {
//   res.clearCookie("token");
//   res.json({ message: "Successfully Signout!" })
// })

// const currentUser = catchAsyncErorrs(async (req, res, next) => {
//   const user = await User.findById(req.id).exec();
//   res.json({ user })
// })



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

  //i have also make the twillio phone otp but they block my account that comment it..
  // client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
  // .verifications
  // .create({ to:'+917694869561', channel: 'sms' })
  // .then(verification => {
  //     console.log('Phone Verification SID:', verification.sid);
  //     res.status(200).json({ message: 'OTP sent successfully.' });
  // })
  // .catch(error => {
  //     console.error('Error sending Phone OTP:', error);

  //     next(new ErrorHandler('Failed to send Phone OTP', 500));
  // });



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



//twillio verify but they block my account when i was test again and again 

//   const isverifyPhone = await client.verify
//   .v2.services(process.env.TWILIO_SERVICE_SID) 
//   .verificationChecks.create({
//     to: `+91${phoneNo}`,
//     code: phoneOtp,
//   })
//   .then((verifyResponse) => {
//     if (verifyResponse.status === 'approved') {
//       return true;
//     } else {
//       return false;
//     }
//   })
//   .catch((err) => {
//     console.error('Error verifying OTP:', err);
//     return false;
//   });

// console.log(isverifyPhone);

// if (!isverifyPhone) {
//   return res.status(400).json({ message: "Invalid OTP!" });
// }

const updatedUser = await User.findOneAndUpdate(
  { email: email},
  { $set: { is_verified: true } },
  { new: true }
);

return res.status(200).json({ message: "Your account has been verified..." });


})
module.exports = { home, signUp,verifyOtp, send }