const express=require("express");
const app=express();
require("dotenv").config({path:'./.env'})
const logger=require("morgan")
const panRoute=require("./routes/panRoute.js");
const adharRoute=require("./routes/adharRout.js");
const userRoute=require("./routes/userRoute.js")
const session=require('express-session');
const cookieparser=require('cookie-parser');
const ErorrHandlers=require("./utills/ErorrHandlers.js");
const {generatedErorrs}= require("./middlewares/erorrs.js");
require("./models/db.js").connectDatabase();
const cors=require('cors');


//logger help to know which route is hit on console..
app.use(logger('tiny'));

//body-parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//use cors 
app.use(cors({ origin: true, credentials: true }));

//session & cookie parser
app.use(session({
resave:true,
saveUninitialized:true,
secret:process.env.EXPRESS_SESSION_SECRET
}))

app.use(cookieparser());

//routes
app.use('/',userRoute);
app.use('/adhar',adharRoute);
app.use('/pan',panRoute);



//erorr handling...
app.all("*",(req,res,next)=>{
    next(new ErorrHandlers(`Requested Url Not Found ${req.url}`))
});
app.use(generatedErorrs);



app.listen(process.env.PORT,console.log('server run on port',process.env.PORT))