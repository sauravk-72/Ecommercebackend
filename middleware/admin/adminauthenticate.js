const adminDB = require("../../model/admin/adminModel")
const jwt=require("jsonwebtoken")
const SECRET_KEY=process.env.ADMIN_SECRET_KEY


const adminauthenticate=async(req,res,next)=>{
    try {
        const token=req.headers.authorization; //we will pass token in headers named as authoriztaion
        const verifyToken=jwt.verify(token,SECRET_KEY) //verify passed token and secretkey
        const rootUser=await adminDB.findOne({_id:verifyToken._id}); //we get id from the token then we will match it with id from mongodb and find user
        if(!rootUser){throw new Error("user not found")}
//after verification token,user details would be sent
        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();
    } catch (error) {
        res.status(400).json({error:"Unauthorized no token provided"})
    }
}

module.exports = adminauthenticate;