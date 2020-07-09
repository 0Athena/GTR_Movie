import details from '../models/movie.details.model'
import errorHandler from '../helpers/dbErrorHandler'

const movieByID = async (req , res , next , id)=>{
    try{
        // findOne({nick: 'noname'}, function(err,obj) { console.log(obj); });
        let movDetail = await details.findById(id)
        if( !movDetail){
            return res.status('400').json({ error: "Movie Not Found"})
        }
        req.details = movDetail
        next()
    }catch(err){
        return res.status('400').json({
            error: "Could Not Retrieve Movie"
        })
    }
}

const read = (req , res)=>{
    return res.json(req.details)
}

const listGenres = async (req , res)=>{
    try {
        let movies = await  details.distinct('genres',{}) // distinct choose genres from the DB which for example instead of {} -> {"id": 1} it returns the genres with id 1 
        res.json(movies)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        }) 
    }
}


const list = async ( req , res)=>{
    const query = {}
    if(req.query.search){
        query.title = { '$regex': req.query.search, '$options': "i"}
    }
    if(req.query.genres && req.query.genres != 'All'){
        //query.genres = req.query.genres
        //req.genre = { '$regex': req.query.genre, '$options': "i"}
        query.genres = { '$regex': req.query.genres, '$options': "i"}
    }
    try {
        let movies = await details.find( query ).select('title release_date genres').exec()
        
        res.json(movies)
        var json ="[{'id': 14, 'name': 'Fantasy'}, {'id': 28, 'name': 'Action'}, {'id': 12, 'name': 'Adventure'}]"
       var newJson = json.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
        newJson = newJson.replace(/'/g, '"');   
        var data = JSON.parse(newJson);
        console.log(data)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        }) 
    }
}
export default { movieByID , read , listGenres ,list }