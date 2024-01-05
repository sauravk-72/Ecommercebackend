const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const SECRET_KEY=process.env.USER_SECRET_KEY

//User schema
const userSchema=new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Not valid email")
            }
        }
    }, 
   
    password:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required :true
            }
        }
    ],

    //forgotpassword
    verifytoken:{
        type:String
    }
},{timestamp:true})

//passowrd hashing
userSchema.pre("save",async function(next){
    //agar modify krna chahe tb hi value change ho warna na ho
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next()
});

// token generate
userSchema.methods.generateuserAuthToken = async function(){
    try {
        let newtoken = jwt.sign({_id:this._id},SECRET_KEY,{
            expiresIn:"1d"
        });

        this.tokens = this.tokens.concat({token:newtoken});

        await this.save()
        return newtoken;
    } catch (error) {
        res.status(400).json({error:error})
    }
}

//user model
const userDB=new mongoose.model("UserDbs",userSchema)
module.exports=userDB;