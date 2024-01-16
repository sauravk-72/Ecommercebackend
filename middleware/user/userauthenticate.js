
const jwt=require("jsonwebtoken")
const userDB = require("../../model/user/userModel")
const SECRET_KEY=process.env.USER_SECRET_KEY


const userauthenticate=async(req,res,next)=>{
    try {
        
        const token=req.headers.authorization; //we will pass token in headers named as authoriztaion
        const verifyToken=jwt.verify(token,SECRET_KEY) //verify passed token and secretkey
        const rootUser=await userDB.findOne({_id:verifyToken._id}); //we get id from the token then we will match it with id from mongodb and find user
        if(!rootUser){throw new Error("user not found")}
//after verification token,user details would be sent
        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id //this will return id as  object
        req.userMainId=rootUser.id //this will return id as a string

        next();
    } catch (error) {
        res.status(400).json({error:"Please Login To Your Account"})
    }
}

module.exports = userauthenticate;