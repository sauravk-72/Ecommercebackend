const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    productimage:{
        type:String,
        required:true
    },
   discount:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
   categoryid:{
        type:String,
        required:true
    },
},{timestamp:true})

const productsdb=new mongoose.model("productmodels",productSchema)
module.exports=productsdb