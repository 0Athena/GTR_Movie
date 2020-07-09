import mongoose from 'mongoose'
import { Double } from 'mongodb'

//movie detials 
const movDetailsSchema = new mongoose.Schema({
    // , backdrop_path, poster_path , homepage , imdb_id , original_language , original_title , overview , 
    // release_date , status , tagline , title , genres , video , spoken_languages , belongs_to_collection
    adult:
    {
        type: String,
        trim: true
    },
    title:{
        type: String,
        trim: true,
    },
    // , id , revenue
    budget:{
        type: Number
    },
    genres: {
        type: String,
        trim: true
    },
    release_date:{
        type: String
    }
    // popularity, runtime , vote_average: {
    //     type: Double
    // }

})

export default mongoose.model('details', movDetailsSchema)