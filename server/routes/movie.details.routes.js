import express from 'express'
import movDetCtrl from '../controllers/movie.details.controller'

const router = express.Router()

router.route('/api/movieDetails/:movieID').get(movDetCtrl.read)
router.route('/api/movie/genres').get(movDetCtrl.listGenres)
//search movie api
router.route('/api/movies').get(movDetCtrl.list)
router.param('movieID', movDetCtrl.movieByID)

export default router