// controllers/movieController.js
// The controller holds the "brain" of the API: it receives the request,
// works with the data, and sends back the response.

// Temporary "database": just an array that lives in memory.
// It resets every time the server restarts.
let movies = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, watched: true },
  { id: 2, title: 'The Dark Knight', genre: 'Action', year: 2008, watched: true },
  { id: 3, title: 'Interstellar', genre: 'Sci-Fi', year: 2014, watched: false },
  { id: 4, title: 'Parasite', genre: 'Thriller', year: 2019, watched: false },
  { id: 5, title: 'Coco', genre: 'Animation', year: 2017, watched: true },
];

// Used to give each new movie a unique ID.
// We use a counter (not movies.length + 1) so IDs never get reused after a delete.
let nextId = 6;

// ---------- Helper functions ----------

// IDs come from the URL as text ("3"), so we convert and check them.
// Returns a number if valid, or null if the ID is invalid (e.g. "abc", "-2", "1.5").
const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Checks the movie fields. Returns a list of problems (empty list = all good).
// When isPartial is true (used for updates), only fields that were sent get checked.
const validateMovieData = (data, isPartial = false) => {
  const errors = [];
  const { title, genre, year, watched } = data;

  if (!isPartial || title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    }
  }
  if (!isPartial || genre !== undefined) {
    if (typeof genre !== 'string' || genre.trim() === '') {
      errors.push('genre is required and must be a non-empty string');
    }
  }
  if (!isPartial || year !== undefined) {
    const maxYear = new Date().getFullYear() + 5;
    if (!Number.isInteger(year) || year < 1888 || year > maxYear) {
      errors.push(`year is required and must be a whole number between 1888 and ${maxYear}`);
    }
  }
  if (!isPartial || watched !== undefined) {
    if (typeof watched !== 'boolean') {
      errors.push('watched is required and must be true or false');
    }
  }
  return errors;
};

// ---------- Controller functions ----------

// GET /api/movies
const getAllMovies = (req, res) => {
  res.status(200).json(movies);
};

// GET /api/movies/:id
const getMovieById = (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'Invalid movie ID. It must be a positive whole number.' });
  }

  const movie = movies.find((m) => m.id === id);
  if (!movie) {
    return res.status(404).json({ message: `Movie with ID ${id} not found` });
  }

  res.status(200).json(movie);
};

// POST /api/movies
const createMovie = (req, res) => {
  // req.body can be undefined if no JSON was sent, so we fall back to {}
  const data = req.body || {};

  const errors = validateMovieData(data);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid movie data', errors });
  }

  const newMovie = {
    id: nextId++,
    title: data.title.trim(),
    genre: data.genre.trim(),
    year: data.year,
    watched: data.watched,
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
};

// PUT /api/movies/:id
const updateMovie = (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'Invalid movie ID. It must be a positive whole number.' });
  }

  const movie = movies.find((m) => m.id === id);
  if (!movie) {
    return res.status(404).json({ message: `Movie with ID ${id} not found` });
  }

  const data = req.body || {};
  const allowedFields = ['title', 'genre', 'year', 'watched'];
  const hasAtLeastOneField = allowedFields.some((field) => data[field] !== undefined);
  if (!hasAtLeastOneField) {
    return res.status(400).json({
      message: 'Send at least one field to update: title, genre, year or watched',
    });
  }

  // Partial validation: only check the fields the user actually sent
  const errors = validateMovieData(data, true);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid movie data', errors });
  }

  // Only overwrite the fields that were sent
  if (data.title !== undefined) movie.title = data.title.trim();
  if (data.genre !== undefined) movie.genre = data.genre.trim();
  if (data.year !== undefined) movie.year = data.year;
  if (data.watched !== undefined) movie.watched = data.watched;

  res.status(200).json(movie);
};

// DELETE /api/movies/:id
const deleteMovie = (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'Invalid movie ID. It must be a positive whole number.' });
  }

  const index = movies.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ message: `Movie with ID ${id} not found` });
  }

  // splice removes the movie from the array and returns it inside an array
  const [deletedMovie] = movies.splice(index, 1);
  res.status(200).json({ message: 'Movie deleted successfully', movie: deletedMovie });
};

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };
