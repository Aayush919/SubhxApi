const express=require('express');
const router=express.Router();
 const {home,signUp,signIn, signOut, currentUser,verifyOtp,send}=require("../controller/userController.js")
const {isAuth}=require("../middlewares/auth.js");



router.get("/",isAuth,home)
router.post("/signUp",signUp)
// router.post("/signIn",signIn);
// router.post("/user",isAuth,currentUser);
// router.get("/signOut",isAuth,signOut);
router.post("/user/send-mail",send);
router.post("/user/verify-otp",verifyOtp);

module.exports=router;