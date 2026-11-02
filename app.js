// app.js - the entry point. Sets up Express and starts the server.

const express = require('express');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: lets Express read JSON sent in the request body (req.body)
app.use(express.json());

// Any URL starting with /api/movies is handled by movieRoutes
app.use('/api/movies', movieRoutes);

// If no route matched, send a JSON 404 instead of Express's default HTML page
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error-handling middleware (has 4 parameters). Catches things like broken JSON bodies.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
