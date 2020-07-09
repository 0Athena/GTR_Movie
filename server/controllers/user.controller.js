import User from '../models/user.model'
import extend from 'lodash/extend' // when updating an existing user with changed values
import errorHandler from '../helpers/dbErrorHandler'

const create = async(req , res)=>{
    const user = new User(req.body)
    try{
        await user.save() // save the new user in the DB
        return res.status(200).json({
            message: "successfully signed up"
        })
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async(req , res)=>{
    try{
        let users = await User.find().select('name email updated created')
        res.json(users)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// the purpose of the following controller is to make sure the requested user 
// is in the DB and if the user is found then the user object is appended 
// to the requested object in the profile key then if the original request
// was to read a user profile the next() call in userByID would go to the read controller

const userByID = async (req , res , next , id)=>{
    try{
        let user = await User.findById(id)
        if( !user ){
            return res.status('400').json({
                error: "User Not Found"
            })
        }
        req.profile = user 
        next() // this middleware will go to the next controller here (read)
    }catch(err){
        return res.status('400').json({
            error: "Could Not Retrieve User"
        })
    }
}

// read is a function
const read = ( req , res)=>{
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}


// update is controller 
const update = async (req , res)=>{
    try{
        let user = req.profile 
        //module extend to merge and extend changes that came in the request body to update the user data
        user = extend( user , req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined 
        user.salt = undefined
        res.json(user)
    }catch(err){
        return res.status(400).json({
            error : errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async( req , res)=>{
    try{
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default { create, userByID, read, list, remove, update }