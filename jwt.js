const jwt=require("jsonwebtoken");

const jwtAuthMiddleware=(req,res,next)=>{
    //check if the request headers are authorized or not
    const authorization=req.headers.authorization;
    if(!authorization) return res.status(401).json({err:"Token not found"});
    //extracts the jwt token from the request headers
    const token=req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:"unathourized"});

    try{
        //verify the jwt token
        const decoded=jwt.verify(token, process.env.JWT_SECRET);

        //attach user information to the request object
        req.user=decoded;
        next();

    }catch(err){
        console.error(err);
        res.status(401).json({err:"Invalid token"});
    }
}

//generating JWT token
const generateToken=(userData)=>{
    //generate a new jwt token by using user data
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:300000000});
}

module.exports={jwtAuthMiddleware,generateToken}