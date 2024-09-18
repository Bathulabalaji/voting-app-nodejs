const express=require("express");
const router=express.Router();

const User=require("../models/user");

const {jwtAuthMiddleware,generateToken}=require("../jwt");
const Candidate = require("../models/candidate");

const checkAdminRole=async (userId)=>{
    try{
        const user= await User.findById(userId);
        return user.role==="admin";
    }catch(err){
        return false;
    }
}

router.post('/candidate',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message:'user has not admin role'});
        }
    // const data=new CandidateModel({
    //     name:req.body.name,
    //     id:req.body.id,
    //     email:req.body.email,
    //     mobile:req.body.mobile,
    //     age:req.body.age,
    //     address:req.body.address,
    //     work:req.body.work,
    //     salary:req.body.salary,
    //     Candidatename:req.body.Candidatename,
    //     password:req.body.password
    // });

    const data=req.body

    //create the new Candidate document using the mongoose model
    const newCandidate=new Candidate(data);
    console.log(data);

    //save the new Candidate in the database
    const response=await newCandidate.save();
    console.log("data saved");

    // const payload={
    //     id: response.id
    // }
    // console.log("payload:",JSON.stringify(payload));
    // const token=generateToken(payload);
    // console.log("token is :",token);


    return res.status(200).json({response:response});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({err:'internal server error'});
    }
})



router.put('/candidate/:candidateId',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!await checkAdminRole(req.user.id)){
            return res.status(403).json({message:'user has not admin role'});
        }
        const candidateId=req.params.candidateId; //extract the id from the token
        const updateCandidateData=req.body; //updated data for the person

        //find the Candidate by CandidateId
        const response=await Candidate.findByIdAndUpdate(candidateId,updateCandidateData,{
            new:true, //return the updated document
            runValidators:true,
        })
        if(!response){
            return res.status(404).json({error: 'Candidate not found'});
        }
        
        console.log("candidate data updated!!");
        return res.status(200).json(response);
    }catch(err){
        console.log(err);
        return res.status(500).json({err:"Internal server error!!"});
    }

})

router.delete('/candidate/:candidateId',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!await checkAdminRole(req.user.id)){
            return res.status(403).json({message:'user has not admin role'});
        }
        const candidateId=req.params.candidateId; //extract the id from the token

        //find the Candidate by CandidateId
        const response=await Candidate.findByIdAndDelete(candidateId);
        if(!response){
            return res.status(404).json({error: 'Candidate not found'});
        }
        
        console.log("candidate deleted!!");
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        return res.status(500).json({err:"Internal server error!!"});
    }

})


//Voting

router.post('/candidate/vote/:candidateId',jwtAuthMiddleware,async (req,res)=>{
    //no admin can vote
    //user can only vote once
    candidateId=req.params.candidateId;
    userId=req.user.id;
    try{
        //find the candidate document with the specified candidateId
        const candidate=await Candidate.findById(candidateId);

        if(!candidate){
            return res.send(404).json({message: 'Candidate not found to vote'});
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'user not found to vote'});
        }
        if(user.isVoted){
            return res.status(400).json({message: 'you have already voted'});
        }
        if(user.role==='admin'){
            return res.status(403).json({message: 'admins are not allowed to vote'});
        }

        //update the candidate document to record the vote

        candidate.votes.push({user:userId})
        candidate.voteCount++;
        await candidate.save();

        //update the user document

        user.isVoted=true;
        await user.save();

        res.status(200).json({message: 'vote recorded successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).json({err:"Internal server error!!"});
    }
});

router.get('/candidate/vote/count',async (req,res)=>{
    try{
        //find all the candidates and sort them by votecount in descending order
        const candidate=await Candidate.find().sort({voteCount:'desc'});

        //map the candidates to only return their party name and votecount

        const voteRecord=candidate.map((data)=>{
            return{
                party:data.party,
                count:data.voteCount
            }
        });
        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        return res.status(500).json({err:"Internal server error!!"});
    }
})

router.get('/candidate/candidates',async (req,res)=>{
    try{
        //find all the candidates
        const candidate=await Candidate.find();

        //map the candidates to only return their name and party name

        const candidatesList=candidate.map((data)=>{
            return{
                name:data.name,
                party:data.party
            }
        });
        return res.status(200).json(candidatesList);
    }catch(err){
        console.log(err);
        return res.status(500).json({err:"Internal server error!!"});
    }
})
module.exports=router;