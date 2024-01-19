
//after one minut you can send otp again

const oneMinute = async (otpTime) => {
    const datetime = new Date();
    console.log(otpTime)
    var diff = (otpTime-datetime.getTime()) / 1000;
    diff /= 60;
   const d=Math.abs(diff);
   console.log(d)
    if (d > 1) {
        console.log(true);
        return true;
    } 
    return false;
}


//otp validate for 10 minute afte 10 minute this otp expires

const TenMinute =async (otpTime) => {
    const datetime = new Date();
    console.log(otpTime)
    var diff = (otpTime-datetime.getTime()) / 1000;
    diff /= 60;
   const d=Math.abs(diff);
   console.log(d)
    if (d > 10) {
        return true;
    } 
    return false;
}



module.exports={oneMinute,TenMinute};