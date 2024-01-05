const categorydb=require("../../model/product/productCategoryModel")
const cloudinary=require("cloudinary")
const productsdb=require("../../model/product/ProductModel")
const productreviewdb=require("../../model/product/productreviewModel")


exports.AddCategory=async(req,res)=>{
const {categoryname,description}=req.body
if(!categoryname||!description){
    res.status(400).json({error:"Fill all details"})
}
try {
    const existingcategory=await categorydb.findOne({categoryname:categoryname});
    if(existingcategory){
        res.status(400).json({error:"This category already exists"})
    }else{
        const addCategory=new categorydb({categoryname,description})
        await addCategory.save()
        res.status(200).json(addCategory)
    }
} catch (error) {
    res.status(400).json(error)
}
}

//get category
exports.GetCategory=async(req,res)=>{
    try {
        const getAllcategory=await categorydb.find()
        res.status(200).json(getAllcategory)
    } catch (error) {
        res.status(400).json(error)
    }
}

//add products
exports.AddProducts = async(req,res)=>{
    
  const {categoryid} = req.query;
  const file = req.file ? req.file.path :""
  const {productname,price,discount,quantity,description} = req.body;

  if(!productname || !price || !discount || !quantity || !description || !file){
      res.status(400).json({error:"all filed required"});
  }

  try {
      const upload = await cloudinary.uploader.upload(file);

      const existingProduct = await productsdb.findOne({productname:productname});

      if(existingProduct){
          res.status(400).json({error:"This Product Already Exist"});
      }else{
          const addProduct = new productsdb({
              productname,price,discount,quantity,description,categoryid,productimage:upload.secure_url
          });

          await addProduct.save();
          res.status(200).json(addProduct)
      }
  } catch (error) {
      res.status(400).json(error);
  }
}

// getAllProducts
exports.getAllProducts = async(req,res)=>{
//if categoryid is given then use it else leave it blank
    const categoryid = req.query.categoryid || ""
    //if page is defined then serve that page else open page1
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 6;
//array to store categoryid
    const query = {}
//if category id is  not all then set the categryid
    if(categoryid !== "all" && categoryid){
        query.categoryid = categoryid
    }

    
    try {
//products to be skiiped in particular page
        const skip = (page - 1) * ITEM_PER_PAGE // (3 - 1) * 8 = 8

        // Total no of products
        const count = await productsdb.countDocuments(query);
        


        const getAllProducts = await productsdb.find(query)
        .limit(ITEM_PER_PAGE)  //per page limit
        .skip(skip); //No items to tbe skipped .if we are on page 3 then first 16 products will be not shown..next procts will be shown
//total no pages required
        const pageCount = Math.ceil(count/ITEM_PER_PAGE); // 2/8 = 1/4 = 0.25 = 1 
    
        
        res.status(200).json({getAllProducts,
            Pagination:{
                totalProducts:count,pageCount
            }
        })
    } catch (error) {
        res.status(400).json(error);
        
    }
}

// getSingleProduct
exports.getSingleProduct = async(req,res)=>{
    const {productid} = req.params;

    try {
        const getSingleProductdata = await productsdb.findOne({_id:productid});
        res.status(200).json(getSingleProductdata)
    } catch (error) {
        res.status(400).json(error);
        
    }
}

// getLatestProducts
exports.getLatestProducts = async(req,res)=>{
    try {
        const getNewProducts = await productsdb.find()
        .sort({_id:-1});   //-1 will give data in reverse orderjo data last me hai wo phle milega aur vicevera
        res.status(200).json(getNewProducts)
    } catch (error) {
        res.status(400).json(error);
    }
}


// DeleteProducts
exports.DeleteProducts = async(req,res)=>{
    const {productid} = req.params;
    try {
        const deleteProducts = await productsdb.findByIdAndDelete({_id:productid});
        res.status(200).json(deleteProducts);
    } catch (error) {
        res.status(400).json(error);
        
    }
}


//product review
exports.productreview=async(req,res)=>{
    const {productid}=req.params;
    const{username,rating,description}=req.body
    if(!username || !rating || !description || !productid){
        res.status(400).json({error:"All Field is Required"})
    }
    try {
        const productreviewadd = new productreviewdb({
            userid:req.userMainId,productid,username,rating,description
        });

        await productreviewadd.save(productreviewadd);
        res.status(200).json(productreviewadd)
    } catch (error) {
        res.status(400).json(error)
    }
}

// getproductreview
exports.getproductreview = async(req,res)=>{
    const {productid} = req.params;
    try {
        const getreview = await productreviewdb.find({productid:productid});
        res.status(200).json(getreview)
    } catch (error) {
        res.status(400).json(error);
    }
}

// DeleteProductreview
exports.DeleteProductreview = async(req,res)=>{
    const {reviewid} = req.params;
    try {
        const reviewDelete = await productreviewdb.findByIdAndDelete({_id:reviewid});
        res.status(200).json(reviewDelete)
    } catch (error) {
        res.status(400).json(error);
    }
}

// getproductreview
exports.getproductreview = async(req,res)=>{
    const {productid} = req.params;
    try {
        const getreview = await productreviewdb.find({productid:productid});
        res.status(200).json(getreview)
    } catch (error) {
        res.status(400).json(error);
    }
}

// DeleteProductreview
exports.DeleteProductreview = async(req,res)=>{
    const {reviewid} = req.params;
    try {
        const reviewDelete = await productreviewdb.findByIdAndDelete({_id:reviewid});
        res.status(200).json(reviewDelete)
    } catch (error) {
        res.status(400).json(error);
    }
}