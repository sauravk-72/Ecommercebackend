const express=require("express");
const adminauthenticate = require("../../middleware/admin/adminauthenticate");
const router=new express.Router();
const productController=require("../../controllers/product/productController")
const productupload=require("../../multerconfig/products/productStorageConfig")
const userauthenticate=require("../../middleware/user/userauthenticate")

//products category routes
router.post("/addcategory",adminauthenticate,productController.AddCategory);
router.get("/getcategory",productController.GetCategory)

//products routes
router.post("/addProducts",[adminauthenticate,productupload.single("productimage")],productController.AddProducts);
router.get("/getProducts",productController.getAllProducts)
router.get("/getsingleProduct/:productid",productController.getSingleProduct)
router.delete("/products/:productid",adminauthenticate,productController.DeleteProducts);


// new arrival products
router.get("/getLatestProducts",productController.getLatestProducts);

//productreview
router.post("/productreview/:productid",userauthenticate,productController.productreview)
router.get("/getProductreview/:productid",productController.getproductreview);
router.delete("/productreviewdelete/:reviewid",userauthenticate,productController.DeleteProductreview);


module.exports=router