import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

async function searchMovies(query, options = {}) {
    try {
        const params = {
            query: query,
            page: options.page || 1,
            year: options.year
        };

        const response = await tmdbClient.get('/search/movie', { params });
        return response.data;
    } catch (error) {
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
