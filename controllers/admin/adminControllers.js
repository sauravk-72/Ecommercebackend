const adminDB = require("../../model/admin/adminModel")
const cloudinary = require("../../Cloudinary/cloudinary")
const bcrypt = require("bcryptjs")



//register controller
exports.Register = async (req, res) => {  //exporting register
    //Getting values 
    const { name, email, mobile, password, cpassword } = req.body
    //Valiadting
    if (!name || !email || !mobile || !req.body) {
        res.status(400).json({ error: "All fields are required" })
    }
    //? is used if there would be no value in path then it will not show error
    const file = req.file?.path;  ///getting path
    const upload = await cloudinary.uploader.upload(file); //uploading
    try {
        const preuser = await adminDB.findOne({ email: email }) //first eamil is from database and second is the one we are entering to create user
        const mobileverification = await adminDB.findOne({ mobile: mobile })
        if (preuser) {
            req.status(400).json({ error: "This admin already exist" })
        } else if (mobileverification) {
            res.status(400).json({ error: "This number already exists" })
        } else if (password !== cpassword) {
            res.status(400).json({ error: "Password and confirm password are not matching" })
        } else {
            //create user
            const adminData = new adminDB({
                name, email, mobile, password, profile: upload.secure_url
            });
            //Storing data on mongodb
            await adminData.save();
            //sending respons
            res.status(200).json(adminData)
        }

    } catch (error) {
        res.status(400).json({ error: "error" })
    }
}


//login controller
exports.Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "All fields required" })
    }
    try {
        //checking if user exists or not
        const adminValid = await adminDB.findOne({ email: email }); //storing details in variable admindata
        if (adminValid) {
            const isMatch = await bcrypt.compare(password, adminValid.password)
            if (!isMatch) {
                res.status(400).json({ error: "Invalid details" })
            } else {
                //token generate..creating function
                const token = await adminValid.generateAuthToken();
                //Sending data and token
                const result = {
                    adminValid, token
                }
                 return res.status(200).json(result)
            }
        }else {
                res.status(400).json({ error: "Invalid details" })
            }
        
    } catch (error) {
        res.status(400).json(error)
    }
}


//admin verify controller
exports.AdminVerify=async(req,res)=>{try {
    const VerifyAdmin=await adminDB.findOne({_id:req.userId})
    res.status(200).json(VerifyAdmin)
} catch (error) {
    res.status(400).json({error:"Invalid Details"})
}
}

//admin logout controller
exports.Logout=async(req,res)=>{
    try {
        req.rootUser.tokens=req.rootUser.tokens.filter((currentElement)=>{
            return currentElement.token !==req.token //give tokens which are not matching
        })
        req.rootUser.save()
        res.status(400).json({message:"User succesfully logout"})
    } catch (error) {
     res.status(400).json(error)   
    }
}