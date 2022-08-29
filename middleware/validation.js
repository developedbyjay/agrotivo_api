const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace("Bearer ",'')
        const decoded = jwt.verify(token,"TOKEN");
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: "Please Authenticate"})
    }
}

const admin = (req,res,next)=> {
    auth(req,res,()=>{
        if(req.user.isAdmin){
           return next()
        }
        res.status(400).send(`You are not authorized`)
    })
}

const authVendor = (req,res,next) => {
    auth(req,res,()=>{
        if(req.user.isVendor === true || req.user.isAdmin === true){
           return next()
        }
        res.status(400).send(`You are not authorized`)
    })
}
module.exports = {
    auth,
    admin,
    authVendor
}