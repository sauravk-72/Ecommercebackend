const orderDb=require("../../model/order/OrderModel")
const moment=require("moment")
const userDB = require("../../model/user/userModel")
const {transporter, orderConfirmationTemplate}=require("../../helper");

exports.Addorders=async(req,res)=>{
   const {address,city,pincode,country,state,mobile,itemsPrice,shippingPrice,totalPrice,orderItems,paymentdetails,orderstatus}=req.body

   const deliverydate= moment().add(5, 'days').format('DD-MM-YYYY')
   try {
    const createOrder=new orderDb({
        userid:req.userId,address,city,pincode,country,state,mobile,itemsPrice,shippingPrice,totalPrice,orderItems,paymentdetails,orderstatus,deliveredAt:deliverydate
    })
    await createOrder.save()
    res.status(200).json(createOrder)
   } catch (error) {
    res.status(400).json(error)
   }
}

// getUserOrders -- user
exports.getUserOrders = async (req, res) => {
    try {
        const getUserOrders = await orderDb.find({ userid: req.userId }).sort({ _id: -1 });

        res.status(200).json(getUserOrders)
    } catch (error) {
        res.status(400).json(error);
    }
}


exports.getAllorders=async(req,res)=>{
    try {
        const getOrders=await orderDb.find().sort({_id:-1})
        res.status(200).json(getOrders)
    } catch (error) {
        res.status(400).json(error)
    }
}
exports.updateOrderstatus=async(req,res)=>{
    const {orderid}=req.params;
    const {orderStatus}=req.body;
    try {
        const findOrderDetails=await orderDb.findOne({_id:orderid})
        const userdetails= await userDB.findOne({_id:findOrderDetails.userid})
        if(findOrderDetails.orderstatus=="Processing" && orderStatus=="Confirmed"){
            const updateOrder=await orderDb.findByIdAndUpdate({_id:orderid},{orderstatus:orderStatus},{new:true})
            await updateOrder.save();

            //Send Invoice For Order COnfirmation
            const mailOptions = {
                from:process.env.EMAIL,//your email
                to:userdetails.email,//email from body
                subject:"Sending Email For Order Confirmation",
                html:orderConfirmationTemplate(findOrderDetails,userdetails)
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("error",error)
                    res.status(400).json({error:"email not send"})
                }else{
                    console.log("email sent",info.response)
                    res.status(200).json({message:"Email sent Sucessfully"})
                }
            })

            res.status(200).json(updateOrder)
        }else if(findOrderDetails.orderstatus=="Confirmed" && orderStatus=="Shipped"){
            const updateOrder=await orderDb.findByIdAndUpdate({_id:orderid},{orderstatus:orderStatus},{new:true})
            await updateOrder.save();
            res.status(200).json(updateOrder)
        }else if(findOrderDetails.orderstatus=="Shipped" && orderStatus=="Delivered"){
            const updateOrder=await orderDb.findByIdAndUpdate({_id:orderid},{orderstatus:orderStatus},{new:true})
            await updateOrder.save();
            res.status(200).json(updateOrder)
        }else{
            res.staus(400).json({error:"Invalid Status"})
        }
    } catch (error) {
        
    }
}