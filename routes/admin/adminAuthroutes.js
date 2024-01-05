const express=require("express");
const router=new express.Router();
const adminAuthcontroller=require("../../controllers/admin/adminControllers")
const adminUpload=require("../../multerconfig/admin/adminStorageConfig")
const adminauthenticate=require("../../middleware/admin/adminauthenticate")

//admin auth routes

router.post("/register",adminUpload.single("admin_profile"),adminAuthcontroller.Register)
router.post("/login",adminAuthcontroller.Login)
router.get("/logout",adminauthenticate,adminAuthcontroller.Logout) 

//admin verify api
router.get("/adminverify",adminauthenticate,adminAuthcontroller.AdminVerify) //as adminveridy we will be hit firs adminauthenticate function be run if verified then verifycontroller would work


module.exports=router;