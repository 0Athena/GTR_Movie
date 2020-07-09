import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt' // to check if user is valid JWT when a protected route is accessed
import config from '../../config/config'


const signin = async( req , res)=>{
    try{
        let user = await User.findOne({ "email" : req.body.email })
        if( !user ){
            return res.status('401').json({ error: "User Not found"})
        }
        if( !user.authenticate(req.body.password)){
            return res.status('401').json({ error: "your email and password don't matche."})
        }
        //JWT module is used to generate a signed JWT using a secret key and the user's _id value
        const token = jwt.sign({_id: user._id}, config.jwtSecret)
        res.cookie('t', token ,{expire: new Date() + 9999 })
        return res.json({
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }catch(err){
        return res.status('401').json({error: "couldn't sign in"})
    }
}

const signout = (req , res)=>{

    res.clearCookie("t")
    return res.status(200).json({
        message: "signout"
    })
}

const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth'
})

const hasAuthorization = ( req , res)=>{
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if( !(authorized)){
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
} 
export default { signin, signout, requireSignin, hasAuthorization }