import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function searchMovies(query, options = {}) {
    try {
        const params = {
            api_key: TMDB_API_KEY,
            query: query,
            page: options.page || 1,
            language: 'en-US',
            include_adult: false
        };

        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });
        return response.data;
    } catch (error) {
        console.error('TMDB API Error:', error.response?.data || error.message);
        throw new Error(`Failed to search movies: ${error.message}`);
    }
}

async function movieDetails(movieId) {
    try {
        const response = await tmdbClient.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
}

async function getGenres() {
    try {
        const response = await tmdbClient.get('/genre/movie/list');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch genres: ${error.message}`);
    }
}

async function getSimilarMovies(movieId) {
    try {
        const response = await tmdbClient.get(`/movie/${movieId}/similar`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch similar movies: ${error.message}`);
    }
}

export {
    searchMovies,
    movieDetails,
    getGenres,
    getSimilarMovies
};
