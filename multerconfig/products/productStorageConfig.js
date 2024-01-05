const multer = require("multer");


// storage config
const storage = multer.diskStorage({
//used to determine destination of image to be uploaded
    destination:(req,file,callback)=>{
        callback(null,"./productsimg")
    },
     //used to determine name of image to be uploaded
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});

// filter
//filter file format to be uploaded
const filefilter = (req,file,callback)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        callback(null,true)
    }else{
        callback(null,false)
        return callback(new Error("Only png, jpg,jpeg formatted Allow"))
    }
}

const productupload = multer({
    storage:storage,
    fileFilter:filefilter
});

module.exports = productupload;
