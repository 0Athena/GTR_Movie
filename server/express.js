import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors' //handle cross-origin requests (requests from different domain)
import helmet from 'helmet' //secure
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import movDetailsRoutes from './routes/movie.details.routes'
import Template from '../template'
import devBundle from './devBundle'
const CURRENT_WORKING_DIR = process.cwd()
const app = express()
devBundle.compile(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) //true use qs while false use queryString
app.use(cookieParser())
app.use(compress())
app.use(cors())
app.use(helmet())

// app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.get('/', (req,res)=>{
    res.status(200).send(Template())
})

// mount routes
app.use('/',userRoutes)
app.use('/',authRoutes)
app.use('/',movDetailsRoutes)

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({"error" : err.name + ": " + err.message})
    }else if (err) {
      res.status(400).json({"error" : err.name + ": " + err.message})
      console.log(err)
    }
  })

export default app