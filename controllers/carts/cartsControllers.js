const productsdb = require("../../model/product/ProductModel")
const cartsdb = require("../../model/carts/cartsModel");

exports.AddtoCart = async (req, res) => {
    const { id } = req.params;

    try {
        //to find the prodduct
        const productfind = await productsdb.findOne({ _id: id });
//To find the user and for particaluar user is this product already exists or not
        const carts = await cartsdb.findOne({ userid: req.userId, productid: productfind._id });
        // console.log("productfind",productfind)
//products available in stock
        if (productfind?.quantity >= 1) {
//if products already exists then
            if (carts?.quantity >= 1) {

                // add to cart
                carts.quantity = carts.quantity + 1
                await carts.save();

                // decfrement product quantity
                productfind.quantity = productfind.quantity - 1
                await productfind.save();

                res.status(200).json({ message: "Product  succesfully increment in your cart" });

//if product doesnt exists in the cart then add it to cart and its quantity becomes 1
            } else {
                const addtocart = new cartsdb({
                    userid: req.userId,
                    productid: productfind._id,
                    quantity: 1
                });

                await addtocart.save();
//products available in stocks after adding into the cart
                productfind.quantity = productfind.quantity - 1
                await productfind.save();

                res.status(200).json({ message: "Product Sucessfully Added In your cart" });
            }
        } else {
            res.status(400).json({ error: "Sold Out" });
        }
    } catch (error) {
          
        res.status(400).json(error)
    }
}
// getCartsValue
exports.getCartsValue = async (req, res) => {

    try {
        //we can use findone method to get carts data but there is one problem if we look at carts data w will only find 
        //product id and id of user..but in carts we nalso need productsdetails thefore we used aggregate method
        // aggregation operations process the data records/documents and return computed results. It collects values from various documents and groups them together and then performs different types of operations on that grouped data like sum, average, minimum, maximum, etc to return a computed result. 
        const getCarts = await cartsdb.aggregate([
            {
                $match: { userid: req.userMainId } //match requires exact id //checks particular id
            },
            //lookup method joinns two table
            { 
                $lookup: {
                    from: "productmodels",//from:location to get data
                    localField: "productid", //localfield:value stored in carts model
                    foreignField: "_id",// foreignfield:in carts collection we have used _id for  products
                    as: "productDetails"//place to store the data
                }
            },
            //we were getting productdetails as array but we want productdetails as object there following operations are performed
            //getting first data from productdetils array
            {
                $project:{
                    _id:1,
                    userid:1,
                    productid:1,
                    quantity:1,
                    productDetails:{$arrayElemAt:['$productDetails',0]}//Extract first element of the product array
                }
            }
        ]);
        res.status(200).json(getCarts)
    } catch (error) {
        res.status(400).json(error)
    }
}
// removeSingleitem
exports.removeSingleitem = async (req, res) => {
    const { id } = req.params;
    try {

        const productfind = await productsdb.findOne({ _id: id });

        const carts = await cartsdb.findOne({ userid: req.userId, productid: productfind._id });

        if (!carts) {
            res.status(400).json({ error: "cart item not found" });
        }

        console.log("carts", carts)

        if (carts.quantity == 1) {
            const deleteCartItem = await cartsdb.findByIdAndDelete({ _id: carts._id });
            // console.log("deleteCartItem",deleteCartItem)

            // increment product quantity
            productfind.quantity = productfind.quantity + 1
            await productfind.save();

            res.status(200).json({ message: "Your item sucessfully removed from your cart", deleteCartItem })
        } else if (carts.quantity > 1) {
            carts.quantity = carts.quantity - 1
            await carts.save();

            // increment product quantity
            productfind.quantity = productfind.quantity + 1
            await productfind.save();

            res.status(200).json({ message: "Your item sucessfully decrement in your Cart" });
        }

    } catch (error) {
        res.status(400).json(error)

    }
}

// removeAllitem
exports.removeAllitem = async(req,res)=>{
    const { id } = req.params;
    try {
        
        const productfind = await productsdb.findOne({ _id: id });

        const carts = await cartsdb.findOne({ userid: req.userId, productid: productfind._id });

        if (!carts) {
            res.status(400).json({ error: "cart item not found" });
        }

        const deleteCartItem = await cartsdb.findByIdAndDelete({_id:carts._id});


        // prodcut increment
        productfind.quantity = productfind.quantity + carts.quantity 
        await productfind.save();


        res.status(200).json({message:"Your item sucessfully removed from your cart",deleteCartItem});
    } catch (error) {
        res.status(400).json(error)
        
    }
}

// DeleteCartsData
exports.DeleteCartsData = async(req,res)=>{
    try {
        const DeleteCarts = await cartsdb.deleteMany({userid:req.userId});
        res.status(200).json(DeleteCarts);
    } catch (error) {
        res.status(400).json(error)
    }
}