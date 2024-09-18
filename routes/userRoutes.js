const express=require("express");
const router=express.Router();

const {jwtAuthMiddleware,generateToken}=require("../jwt");
const User = require("../models/user");


router.post('/user/signup',async(req,res)=>{
    // const data=new userModel({
    //     name:req.body.name,
    //     id:req.body.id,
    //     email:req.body.email,
    //     mobile:req.body.mobile,
    //     age:req.body.age,
    //     address:req.body.address,
    //     work:req.body.work,
    //     salary:req.body.salary,
    //     username:req.body.username,
    //     password:req.body.password
    // });

    const data=req.body

    //create the new user document using the mongoose model
    const newUser=new User(data);
    console.log(data);

    //save the new user in the database
    const response=await newUser.save();
    console.log("data saved");

    const payload={
        id: response.id
    }
    console.log("payload:",JSON.stringify(payload));
    const token=generateToken(payload);
    console.log("token is :",token);


    res.status(200).json({response:response,token:token});
})


//login

router.post('/user/login',async(req,res)=>{
    try{
        //extract aadharCardNumber and password from req.body
        const {aadharCardNumber,password}=req.body;
        //find the user by aadharCardNumber
        const user=await User.findOne({aadharCardNumber:aadharCardNumber});

        //if the user does not exist or password does not match, return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:"Invalid username or password"});
        }
        //generate token
        const payload={
            id: user.id
        }
        const token=generateToken(payload);

        //return token as response 
        console.log("jwt token login:",token);
        res.json({"token":token});
    }catch(err){
        console.log({err:"error"});
        res.status(500).json({err:"Internal server error"});
    }
})



//profile

router.get('/user/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData=req.user;
        console.log("user data:",userData);

        const userId=userData.id;
        const user=await User.findById(userId);
        console.log("user details:",user);
        res.status(200).json({"user details":user});
    }catch(err){
        console.log(err);
        res.status(200).json({err:"Internal server error"});
    }

})

router.put('/user/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userId=req.user.id; //extract the id from the token
        
        const {currentPassword,newPassword}=req.body;
        //find the user by userId
        const user=await User.findById(userId);
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error:"Invalid username or password"});
        }

        user.password=newPassword;
        await user.save();
        
        
        console.log("password updated!!");
        res.status(200).json({message:"password updated"});
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal server error!!"});
    }

})

module.exports=router;