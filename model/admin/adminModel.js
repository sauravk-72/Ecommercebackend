const mongoose = require("mongoose")
const validator=require("validator")
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const SECRET_KEY=process.env.ADMIN_SECRET_KEY

const adminSchema = new mongoose.Schema({
    name: {
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
    profile:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,unique:true,
        minLength:10,
        maxLength:10
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
    ]
})

//password hashing
//before calling save method, hash the password
adminSchema.pre("save",async function(next){
    //agar modify krna chahe tb hi value change ho warna na ho
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next()
});

//Token generate
adminSchema.methods.generateAuthToken = async function(){
    try {
        //id is generated for each user iin mongo ,we will add token to that id
        //When token is verified with secret key ,we wil get user id as output
        let newtoken = jwt.sign({_id:this._id},SECRET_KEY,{
            expiresIn:"1d"
        });
//as token is generated we will add this token to our schema tokens which an array ...see schema
//tokens is an empty array,we will add the generated token
        this.tokens = this.tokens.concat({token:newtoken});

        await this.save()
        return newtoken;
    } catch (error) {
        res.status(400).json({error:error})
    }
}

//admin model-Ceating admin collection

const adminDB=new mongoose.model("admins",adminSchema)
module.exports=adminDB;