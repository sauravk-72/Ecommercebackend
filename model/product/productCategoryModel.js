const { Timestamp } = require("mongodb")
const mongoose=require("mongoose")
 
const productCategorySchema=new mongoose.Schema({
    categoryname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamp:true})

const categorydb=new mongoose.model("categorymodels",productCategorySchema);
module.exports=categorydb;