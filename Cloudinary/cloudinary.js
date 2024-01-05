const cloudinary=require("cloudinary").v2;
cloudinary.config({
    cloud_name:process.env.CLOUD,
    api_key:process.env.APIKEY,
    api_secret:process.env.SECRET
})
module.exports=cloudinary;