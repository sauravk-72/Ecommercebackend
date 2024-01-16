require("dotenv").config()
const express=require("express")
const app=express();
const cors=require("cors")
const port=5000
require("./db/conn")


app.use(cors())
app.use(express.json());


//admin routes -path to adminroutes
const adminAuthroutes=require("./routes/admin/adminAuthroutes");
app.use("/adminauth/api",adminAuthroutes)

//product routes
const productroutes = require("./routes/products/productroutes");
app.use("/product/api",productroutes)

//user routes
const userAuthroutes=require("./routes/user/userAuthRoutes")
app.use("/userauth/api",userAuthroutes)

//cartsroutes
const cartsroutes=require("./routes/carts/cartsroutes")
app.use("/carts/api",cartsroutes)

//payment routes
const paymentroutes=require("./routes/payment/PaymentRoutes")
app.use("/checkout/api",paymentroutes)

//order routes
const orderroutes=require("./routes/order/OrderRoutes")
app.use("/order/api",orderroutes)

app.get("/",(req,res)=>{
    res.status(200).json("Server Start")
})

//Start server
app.listen(port,()=>{
console.log(`Server is running at port ${port}`)
})