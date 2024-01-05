
const mongoose=require("mongoose");

//order schema
const OrderSchema=new mongoose.Schema({
    userid:{
        type:Object,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    orderItems:[],
    paymentdetails:{
        paymentid:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    },
        paidAt:{
            type:Date,
            default:Date.now,
        },
        itemsPrice:{
            //all items price
            type:Number,
            required:true,
            default:0
        },
        shippingPrice:{
            type:Number,
            required:true,
            default:0
        },
        totalPrice:{
            type:Number,
            required:true,
            deafult:0
        },
        orderstatus:{
            type:String,
            required:true,
            default:"Processing"
        },
        deliveredAt:String
},{timestamps:true})

//model
const orderDb=new mongoose.model("orders",OrderSchema)
module.exports=orderDb