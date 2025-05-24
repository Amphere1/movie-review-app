import express from "express";
import MovieList from "../models/movieListModel.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Get user's movie list
router.get('/', verifyToken, async (req, res) => {
    try {
        let movieList = await MovieList.findOne({ userId: req.user._id });
        if (!movieList) {
            movieList = new MovieList({ userId: req.user._id, movies: [] });
            await movieList.save();
        }
        res.json(movieList.movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add movie to list
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { movieId, title, posterPath, category } = req.body;
        let movieList = await MovieList.findOne({ userId: req.user._id });
        
        if (!movieList) {
            movieList = new MovieList({ userId: req.user._id, movies: [] });
        }

        // Check if movie already exists
        const movieExists = movieList.movies.find(m => m.movieId === movieId);
        if (movieExists) {
            return res.status(400).json({ message: 'Movie already in list' });
        }        movieList.movies.push({
            movieId,
            title,
            posterPath,
            category,
            addedAt: new Date(),
            rating: 0,
            tags: []
        });

        await movieList.save();
        res.status(201).json(movieList.movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update movie category/status
router.patch('/:movieId', verifyToken, async (req, res) => {
    try {
        const { category, rating, review, tags } = req.body;
        const movieId = req.params.movieId;

        const movieList = await MovieList.findOne({ userId: req.user._id });
        if (!movieList) {
            return res.status(404).json({ message: 'Movie list not found' });
        }

        const movieIndex = movieList.movies.findIndex(m => m.movieId === movieId);
        if (movieIndex === -1) {
            return res.status(404).json({ message: 'Movie not found in list' });
        }

        // Update movie properties
        if (category) movieList.movies[movieIndex].category = category;
        if (rating !== undefined) movieList.movies[movieIndex].rating = rating;
        if (review) movieList.movies[movieIndex].review = review;
        if (tags) movieList.movies[movieIndex].tags = tags;
        
        if (category === 'watched' && !movieList.movies[movieIndex].watchedAt) {
            movieList.movies[movieIndex].watchedAt = new Date();
        }

        await movieList.save();
        res.json(movieList.movies[movieIndex]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove movie from list
router.delete('/:movieId', verifyToken, async (req, res) => {
    try {
        const movieList = await MovieList.findOne({ userId: req.user._id });
        if (!movieList) {
            return res.status(404).json({ message: 'Movie list not found' });
        }

        const movieIndex = movieList.movies.findIndex(m => m.movieId === req.params.movieId);
        if (movieIndex === -1) {
            return res.status(404).json({ message: 'Movie not found in list' });
        }

        movieList.movies.splice(movieIndex, 1);
        await movieList.save();
        res.json({ message: 'Movie removed from list' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get movies by category
router.get('/category/:category', verifyToken, async (req, res) => {
    try {
        const { sortBy = 'addedAt', sortOrder = 'desc' } = req.query;
        const movieList = await MovieList.findOne({ userId: req.user._id });
        if (!movieList) {
            return res.json([]);
        }

        let movies = movieList.movies.filter(m => m.category === req.params.category);

        // Sort movies based on the specified criteria
        movies.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle special cases for sorting
            if (sortBy === 'title') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            } else if (sortBy === 'rating' && (!aValue || !bValue)) {
                // Put unrated movies at the end
                if (!aValue) return 1;
                if (!bValue) return -1;
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });

        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
