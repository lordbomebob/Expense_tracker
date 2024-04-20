const userModel=require(`../model/user`);
const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)
const RegisterUser = async (req,res) =>{
    const userBody=req.body;
    

    
    
    //check if missing info
    if(!userBody.email ){
        
        return res.status(400).json({
            message:`email missing`
        })
    }
    if(!userBody.password){
        return res.status(400).json({
            message:`password missing`
        })
    }if(!userBody.name){
        return res.status(400).json({
            message:`name missing`
        })
    }

    //checks if the user in the database
    const userExist = await userModel.findOne({email:userBody.email})

    if (userExist){
        return res.status(403).json({
            message: `user already exists, use another email`
        })
    }
    const encryptedPassword= await bcrypt.hash(userBody.password,1)
    const newUser= new userModel({
        name: userBody.name,
        email:userBody.email,
        password:encryptedPassword
    })

    try{
        const savedUser = await newUser.save()
        return res.status(201).json({
            message: `user registerd succesfully`,
            data: savedUser
        })
    }catch(error){
        return res.status(500).json({
            message: `there was a error`,
            error
        })
    }
}

const getUser= async (req,res)=>{
    try{
        const users = await userModel.find()
        return res.status(200).json({
            message:`found the users`,
            data:users
            
        })
    }catch(error){
        return res.status(500).json({
            message:`failed finding users`,
            error
        })
    }
}

const loginUser = async (req,res)=>{
    const userBody = req.body
    if(!userBody.email || !userBody.password){
        return res.status(400).json({
            message:`email, password missing`
        })
    }
    const userExist = await userModel.findOne({email:userBody.email})

    if(!userExist){
        return res.status(401).json({
            message:"user doesn't exist"
        })

    }
    const isPasswordSame= await bcrypt.compare(userBody.password,userExist.password)
    if(!isPasswordSame){
        return res.status(401).json({
            message:`wrong credential`
        })
    }
    
    const accessToken = jwt.sign({
        email:userExist.email,
        name:userExist.name,
        id:userExist._id
    },process.env.JWT_SECRET_KEY)

    const userData={
        id:userExist._id,
        email:userExist.email,
        name:userExist.name,
        token:accessToken
    }

    return res.status(200).json({
        message:`user logged in`,
        data:userData
    })
}
module.exports={
    RegisterUser,
    getUser,
    loginUser
}