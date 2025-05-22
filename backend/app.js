import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import "./config/passport.js"; // just to ensure strategy gets registered
import cors from 'cors';

dotenv.config();

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000',  // React default
        'http://localhost:5173',  // Vite default
        'http://127.0.0.1:5173',  // Alternative localhost
        'http://localhost:4173',  // Vite preview
    ],
    credentials: true, // Allow cookies/auth headers
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control'
    ]
};

// Apply middlewares in correct order
app.use(cors(corsOptions));  // CORS should be first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes come after all middleware
app.use('/api/auth', authRoutes);

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
