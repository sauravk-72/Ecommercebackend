const express=require("express");
const router=new express.Router();
const userUpload=require("../../multerconfig/user/userStorageConfig")
const userController=require("../../controllers/user/userControllers")
const userauthenticate=require("../../middleware/user/userauthenticate")
const adminauthenticate=require("../../middleware/admin/adminauthenticate")


//userauth routes
router.post("/register",userUpload.single("userprofile"),userController.userRegister)
router.post("/login",userController.login)

router.get("/userloggedin",userauthenticate,userController.userverify);
router.get("/logout",userauthenticate,userController.logout);

router.post("/forgotpassword",userController.forgotpassword)
router.get("/forgotpassword/:id/:token",userController.forgotpasswordverify)//id aur token ki value kuch bhi ho skta hai isliye id aur token set kiye hai
router.put("/resetpassword/:id/:token",userController.resetpassword);

// for admin
router.get("/getAlluser",adminauthenticate,userController.getAlluser);
router.delete("/userdelete/:userid",adminauthenticate,userController.userDelete);

//for contact api
router.post("/usercontact",userauthenticate,userController.userContact)

module.exports=router