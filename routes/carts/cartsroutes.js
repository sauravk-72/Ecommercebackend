const express = require("express");
const router = new express.Router();
const cartsControllers = require("../../controllers/carts/cartsControllers");
const userauthenticate=require("../../middleware/user/userauthenticate")



// carts routes
router.post("/addtocart/:id",userauthenticate,cartsControllers.AddtoCart);
router.get("/getcarts",userauthenticate,cartsControllers.getCartsValue)
router.delete("/removesingleitem/:id",userauthenticate,cartsControllers.removeSingleitem);
router.delete("/removeitems/:id",userauthenticate,cartsControllers.removeAllitem);

// delete carts data when order done
router.delete("/removecartdata",userauthenticate,cartsControllers.DeleteCartsData);
module.exports=router