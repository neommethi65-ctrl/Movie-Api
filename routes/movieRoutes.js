// routes/movieRoutes.js
// Routes only connect "HTTP method + URL" to a controller function.
// No CRUD logic lives here.

const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');

router.get('/', getAllMovies);        // GET    /api/movies
router.get('/:id', getMovieById);     // GET    /api/movies/:id
router.post('/', createMovie);        // POST   /api/movies
router.put('/:id', updateMovie);      // PUT    /api/movies/:id
router.delete('/:id', deleteMovie);   // DELETE /api/movies/:id

module.exports = router;
