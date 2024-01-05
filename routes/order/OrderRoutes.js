const express=require("express");
const router=new express.Router();
const userauthenticate=require("../../middleware/user/userauthenticate")
const orderControllers=require("../../controllers/order/orderControllers");
const { Admin } = require("mongodb");
const adminauthenticate = require("../../middleware/admin/adminauthenticate");

//order routes
router.post("/addorders",userauthenticate,orderControllers.Addorders)
router.get("/getuserorders",userauthenticate,orderControllers.getUserOrders)

//for Admin
router.get("/orders",adminauthenticate,orderControllers.getAllorders)
router.put("/orders/:orderid",adminauthenticate,orderControllers.updateOrderstatus)
module.exports=router;