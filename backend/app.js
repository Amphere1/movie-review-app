import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import movieListRoutes from './routes/movieList.js';
import "./config/passport.js";
import cors from 'cors';
import { searchMovies, getGenres } from './services/tmdbService.js';
import verifyToken from './middleware/auth.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

// Apply middlewares in correct order
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/movielist', movieListRoutes);

// Protected search route
app.get('/api/search', verifyToken, async (req, res) => {
    try {
        const { q: query, year, genres } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const options = {
            year: year ? parseInt(year) : undefined,
            genres: genres ? genres.split(',').map(g => parseInt(g)) : undefined
        };

        console.log('Searching movies with query:', query, 'options:', options);
        const results = await searchMovies(query, options);
        console.log('Found results:', results.total_results);
        
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            message: 'Failed to search movies',
            error: error.message 
        });
    }
});

// Get genres route
app.get('/api/search/genres', verifyToken, async (req, res) => {
    try {
        const genres = await getGenres();
        res.json(genres);
    } catch (error) {
        console.error('Failed to fetch genres:', error);
        res.status(500).json({ 
            message: 'Failed to fetch genres',
            error: error.message 
        });
    }
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
