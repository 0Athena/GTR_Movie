// import express from 'express'
// import path from 'path'
// import devBundle from './devBundle'
// import template from './../template'
// import { MongoClient } from 'mongodb'

// const app = express()
// const  CURRENT_WORKING_DIR = process.cwd()
// let port = process.env.PORT || 3000
// const url = process.env.MONGODB_URI || 

// devBundle.compile(app)
// // This will configure the Express app to return static files 
// // from the dist folder when the requested route starts with /dist

// app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR,'dist')))

// app.get('/', (req,res)=>{
//     res.status(200).send(template())
// })

// app.listen(port, function onStart(err){
//     if(err){
//         console.log(err)
//     }
//     console.info('Server started on port %s.', port)
// })

// MongoClient.connect('mongodb+srv://test:test@todo-efyqz.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
import config from '../config/config'
import app from './express'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri ,{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.on('error', ()=>{
    throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.listen(config.port , err =>{
    if(err){
        console.log(err)
    }
    console.info('Server started on port %s', config.port)
})