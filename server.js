const express=require("express");
const app=express();
const userRoutes=require("./routes/userRoutes");
const candidateRoutes=require("./routes/candidateRoutes");

require("dotenv").config();
const {jwtAuthMiddleware}=require("./jwt");

const mongoose=require("mongoose");
const Candidate = require("./models/candidate");

//converting input data into json data
app.use(express.json());

//app.use(passport.initialize());


//mongodb connection
const mongoURL=process.env.DB_URL;
const mongoURLlocal=process.env.DB_URL_LOCAL;
//const mongoURLlocal='mongodb://127.0.0.1:27017/hotel'
mongoose.connect(mongoURLlocal);


//use the routes
app.use('/',userRoutes);
app.use('/',candidateRoutes);


const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server running at port ${port}`);
})